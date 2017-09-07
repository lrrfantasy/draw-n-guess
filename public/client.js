(function () {
  const mouse = {
    click: false,
    move: false,
    pos: { x: 0, y: 0 },
    prevPos: false
  }

  const clear = document.getElementById('clear')
  const canvas = document.getElementById('drawing')
  const context = canvas.getContext('2d')
  const width = window.innerWidth
  const height = window.innerHeight
  const socket = io.connect()

  canvas.width = width
  canvas.height = height

  canvas.onmousedown = e => {
    mouse.click = true
  }
  canvas.onmouseup = e => {
    mouse.click = false
  }
  canvas.onmousemove = ({ clientX, clientY }) => {
    mouse.move = true
    mouse.pos.x = clientX / width
    mouse.pos.y = clientY / height
  }

  socket.on('drawLine', function (data) {
    const line = data.line
    context.beginPath()
    context.lineWidth = 2
    context.moveTo(line[0].x * width, line[0].y * height)
    context.lineTo(line[1].x * width, line[1].y * height)
    context.stroke();
  })

  clear.onmousedown = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clear')
  }

  function mainLoop() {
    if (mouse.click && mouse.move && mouse.prevPos) {
      socket.emit('drawLine', { line: [ mouse.pos, mouse.prevPos ] })
      mouse.move = false
    }
    mouse.prevPos = {x: mouse.pos.x, y: mouse.pos.y}
  }
  setInterval(mainLoop, 25)
}())
