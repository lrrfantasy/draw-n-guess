var express = require('express'),
  app = express(),
  http = require('http'),
  socketIo = require('socket.io');

app.use(express.static(__dirname + '/public'));

const server = http.createServer(app);
server.listen(3000, () => {
  console.log('Server running at :3000');
});
const io = socketIo.listen(server);

let lineHistory = [];
let images = [];
let currentImageId = 0;

io.on('connection', socket => {
  lineHistory.forEach(data => {
    socket.emit('drawLine', data);
  });

  socket.on('drawLine', data => {
    lineHistory.push(data);
    io.emit('drawLine', data);
  });
  socket.on('clear', () => {
    lineHistory = [];
    io.emit('clear');
  });
  socket.on('login', name => {
    io.emit('chat', 'Bot', `Welcome ${name} to join`);
  });

  socket.on('chat', (username, message) => {
    if (
      message.startsWith('http') &&
      (message.endsWith('jpg') || message.endsWith('png'))
    ) {
      io.emit('drawImage', message);
    } else {
      io.emit('chat', username, message);
    }
  });

  images.forEach(image => {
    socket.emit('saveImage', image);
  });

  socket.on('saveImage', imageUrl => {
    const image = {
      id: `image_${currentImageId}`,
      url: imageUrl,
      like: 0,
      dislike: 0,
    };

    images.push(image);

    currentImageId++;
    io.emit('saveImage', image);
  });

  socket.on('like', id => {
    const index = images.findIndex(image => image.id === id);
    if (index >= 0) {
      const image = images[index];

      image.like = image.like + 1;
      io.emit('like', image);
    }
  });

  socket.on('dislike', id => {
    const index = images.findIndex(image => image.id === id);
    if (index >= 0) {
      const image = images[index];

      image.dislike = image.dislike + 1;
      io.emit('dislike', image);
    }
  });
});
