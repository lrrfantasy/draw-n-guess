var express = require('express'),
  app = express(),
  http = require('http'),
  socketIo = require('socket.io'),
  AV = require('leanengine')

AV.init({
  appId: process.env.LEANCLOUD_APP_ID || 's0F62s1DFX5SmNG2vjmsnsHX-gzGzoHsz',
  appKey: process.env.LEANCLOUD_APP_KEY || 'XHbKCGvAie5ynb4iQofnJjS8',
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY || 'Vfwd96VoboBoLE1FmeEV1dER'
})
app.use(AV.express())

app.use(express.static(__dirname + '/public'))

const server = http.createServer(app)
server.listen((process.env.LEANCLOUD_APP_PORT || 3000), () => {
  console.log('Server running at :3000')
})
const io = socketIo.listen(server)

let lineHistory = []
io.on('connection', socket => {
  lineHistory.forEach(line => {
    socket.emit('drawLine', { line })
  })
  socket.on('drawLine', data => {
    lineHistory.push(data.line)
    io.emit('drawLine', { line: data.line })
  })
  socket.on('clear', () => {
    lineHistory = []
  })
})
