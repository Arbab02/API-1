require('dotenv').config()

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('sharedMedia', (media) => {
    // Broadcast the shared media to all other sockets
    socket.broadcast.emit('sharedMedia', media);
  });

  socket.on('disconnect', () => {
    // Handle disconnect event
  });

  socket.on('reconnect', () => {
    // Handle reconnect event
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
