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
  const width = 1200
  const height = 600
  const socket = io.connect()

  canvas.width = width
  canvas.height = height

  canvas.onmousedown = e => {
    mouse.click = true
  }
  canvas.onmouseup = e => {
    mouse.click = false
  }
  canvas.onmousemove = ({ offsetX, offsetY }) => {
    mouse.move = true
    mouse.pos.x = offsetX / width
    mouse.pos.y = offsetY / height
  }

  socket.on('drawLine', data => {
    const line = data.line
    context.beginPath()
    context.lineWidth = 2
    context.moveTo(line[0].x * width, line[0].y * height)
    context.lineTo(line[1].x * width, line[1].y * height)
    context.stroke();
  })

  clear.onmousedown = () => {
    socket.emit('clear')
  }

  socket.on('clear', () => {
    context.clearRect(0, 0, canvas.width, canvas.height)
  })

  function mainLoop() {
    if (mouse.click && mouse.move && mouse.prevPos) {
      socket.emit('drawLine', { line: [mouse.pos, mouse.prevPos] })
      mouse.move = false
    }
    mouse.prevPos = {x: mouse.pos.x, y: mouse.pos.y}
  }
  setInterval(mainLoop, 25)
}())
