(function() {
  const mouse = {
    click: false,
    move: false,
    pos: { x: 0, y: 0 },
    prevPos: false,
    color: '#000',
  };

  const currentColor = document.getElementById('currentColor');
  const palettes = document.querySelectorAll('span[data-color]');
  const clear = document.getElementById('clear');

  const canvas = document.getElementById('drawing');
  const context = canvas.getContext('2d');
  const width = 1200 - 2;
  const height = 600 - 2;

  canvas.width = width;
  canvas.height = height;

  canvas.onmousedown = e => {
    mouse.click = true;
  };
  canvas.onmouseup = e => {
    mouse.click = false;
  };
  canvas.onmousemove = ({ offsetX, offsetY }) => {
    mouse.move = true;
    mouse.pos.x = offsetX / width;
    mouse.pos.y = offsetY / height;
  };

  socket.on('drawLine', data => {
    const { line, color } = data;
    context.beginPath();
    context.lineWidth = 2;
    context.moveTo(line[0].x * width, line[0].y * height);
    context.lineTo(line[1].x * width, line[1].y * height);
    context.strokeStyle = color;
    context.stroke();
  });

  palettes.forEach(palette => {
    palette.onmousedown = e => {
      mouse.color = e.target.getAttribute('data-color');
      currentColor.style.backgroundColor = mouse.color;
      makeCursor(mouse.color);
    };
  });

  clear.onclick = () => {
    $('.ui.modal.clear')
      .modal({
        onApprove: () => {
          socket.emit('clear');
        },
      })
      .modal('show');
  };

  socket.on('clear', () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
  });

  socket.on('drawImage', url => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      context.drawImage(img, 0, 0, width, height);
    };
  });

  function mainLoop() {
    if (mouse.click && mouse.move && mouse.prevPos) {
      socket.emit('drawLine', {
        line: [mouse.pos, mouse.prevPos],
        color: mouse.color,
      });
      mouse.move = false;
    }
    mouse.prevPos = { x: mouse.pos.x, y: mouse.pos.y };
  }

  setInterval(mainLoop, 25);
  function makeCursor(color) {
    var cursor = document.createElement('canvas'),
      ctx = cursor.getContext('2d');

    cursor.width = 4;
    cursor.height = 4;
    ctx.beginPath();
    ctx.rect(0, 0, 4, 4);
    ctx.fillStyle = color;
    ctx.fill();
    canvas.style.cursor = 'url(' + cursor.toDataURL() + '), auto';
  }
  makeCursor('#000');
})();
