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

let tempHistory = [];
const emitDrawLineDelay = 500;
let emitDrawLineTimeout = 0;

io.on('connection', socket => {
  let user;

  socket.emit('drawLines', lineHistory);

  socket.on('drawLine', data => {
    // lineHistory.push(data);
    // io.emit('drawLine', data);

    tempHistory.push(data);
    socket.emit('drawLine', data);

    if (emitDrawLineTimeout) {
      return;
    }

    emitDrawLineTimeout = setTimeout(() => {
      io.emit('drawLines', tempHistory);

      console.log(tempHistory.length);
      lineHistory = [...lineHistory, ...tempHistory];
      tempHistory = [];
      emitDrawLineTimeout = 0;
    }, emitDrawLineDelay);
  });

  socket.on('clear', () => {
    lineHistory = [];
    io.emit('clear');
  });
  socket.on('login', name => {
    user = name;

    io.emit('chat', 'Bot', `Welcome ${name} to join`);
  });

  socket.on('chat', (username, message) => {
    if (
      message.startsWith('http') &&
      (message.endsWith('jpg') || message.endsWith('png'))
    ) {
      io.emit('drawImage', message);
    } else {
      io.emit('chat', user, message);
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
      likeUsers: [],
      dislike: 0,
      dislikeUsers: [],
    };

    images.push(image);

    currentImageId++;
    io.emit('saveImage', image);
  });

  socket.on('like', id => {
    const index = images.findIndex(image => image.id === id);
    if (index >= 0) {
      const image = images[index];

      const userIndex = image.likeUsers.indexOf(user);

      if (userIndex < 0) {
        image.likeUsers.push(user);
        image.like = image.like + 1;

        const userDislikeIndex = image.dislikeUsers.indexOf(user);
        if (userDislikeIndex >= 0) {
          image.dislikeUsers.splice(userDislikeIndex, 1);
          image.dislike = image.dislike - 1;

          io.emit('dislike', image);
        }
      } else {
        image.likeUsers.splice(userIndex, 1);
        image.like = image.like - 1;
      }

      io.emit('like', image);
    }
  });

  socket.on('dislike', id => {
    const index = images.findIndex(image => image.id === id);
    if (index >= 0) {
      const image = images[index];

      const userIndex = image.dislikeUsers.indexOf(user);

      if (userIndex < 0) {
        image.dislikeUsers.push(user);
        image.dislike = image.dislike + 1;

        const userLikeIndex = image.likeUsers.indexOf(user);
        if (userLikeIndex >= 0) {
          image.likeUsers.splice(userLikeIndex, 1);
          image.like = image.like - 1;

          io.emit('like', image);
        }
      } else {
        image.dislikeUsers.splice(userIndex, 1);
        image.dislike = image.dislike - 1;
      }

      io.emit('dislike', image);
    }
  });
});
