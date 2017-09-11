var express = require('express'),
  app = express(),
  http = require('http'),
  socketIo = require('socket.io'),
  AV = require('leanengine')


app.use(express.static(__dirname + '/public'))

const server = http.createServer(app)
server.listen(3000, () => {
  console.log('Server running at :3000')
})
const io = socketIo.listen(server)

let lineHistory = []

io.on('connection', socket => {
  lineHistory.forEach(data => {
    socket.emit('drawLine', data)
  })
  socket.on('drawLine', data => {
    lineHistory.push(data)
    io.emit('drawLine', data)
  })
  socket.on('clear', () => {
    lineHistory = []
    io.emit('clear')
  })
  socket.on('login', name => {
    io.emit('chat', 'Bot', `Welcome ${name} to join!`)
  })

  socket.on('chat', (username, message) => {
    if (message.startsWith('http') &&
      (message.endsWith('jpg') || message.endsWith('png'))) {
        io.emit('drawImage', message)
    } else {
      io.emit('chat', username, message)
    }
  })
})
