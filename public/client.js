(function () {
  const mouse = {
    click: false,
    move: false,
    pos: {
      x: 0,
      y: 0
    },
    prevPos: false,
    color: '#000',
  };

  const currentColor = document.getElementById('currentColor');
  const palettes = document.querySelectorAll('span[data-color]');
  const clear = document.getElementById('clear');

  const canvas = document.getElementById('drawing');
  const context = canvas.getContext('2d');
  const width = 1200 - 2;
  const height = 500 - 2;

  canvas.width = width;
  canvas.height = height;

  let factor = canvas.getBoundingClientRect().width / width;
  let canvasOffset = canvas.getBoundingClientRect();

  $(window).resize(() => {
    factor = canvas.getBoundingClientRect().width / width;
    canvasOffset = canvas.getBoundingClientRect();
  });

  canvas.onmousedown = e => {
    mouse.click = true;
  };
  canvas.onmouseup = e => {
    mouse.click = false;
  };
  canvas.onmousemove = ({
    offsetX,
    offsetY
  }) => {
    mouse.move = true;
    mouse.pos.x = offsetX / width / factor;
    mouse.pos.y = offsetY / height / factor;
  };

  canvas.addEventListener('touchstart', (event) => {
    mouse.click = true;
    const touches = event.touches;

    if (touches && touches.length) {
      const {
        pageX,
        pageY
      } = touches[0];

      mouse.pos.x = (pageX - canvasOffset.x) / width / factor;
      mouse.pos.y = (pageY - canvasOffset.y) / height / factor;
      mouse.prevPos = {
        x: mouse.pos.x,
        y: mouse.pos.y
      };
    }
  })

  canvas.addEventListener('touchend', () => {
    mouse.click = false;
  })

  canvas.addEventListener('touchmove', (event) => {
    const touches = event.touches;

    if (touches && touches.length) {
      const {
        pageX,
        pageY
      } = touches[0];

      mouse.move = true;
      mouse.pos.x = (pageX - canvasOffset.x) / width / factor;
      mouse.pos.y = (pageY - canvasOffset.y) / height / factor;
    }
  })

  const drawLine = data => {
    const {
      line,
      color
    } = data;
    context.beginPath();
    context.lineWidth = 2;
    context.moveTo(line[0].x * width, line[0].y * height);
    context.lineTo(line[1].x * width, line[1].y * height);
    context.strokeStyle = color;
    context.stroke();
  };

  socket.on('drawLines', datas => {
    datas.forEach(data => {
      drawLine(data);
    });
  });

  socket.on('drawLine', data => {
    drawLine(data);
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

    mouse.prevPos = {
      x: mouse.pos.x,
      y: mouse.pos.y
    };
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