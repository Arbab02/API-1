// server.js

require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const messageSchema = new mongoose.Schema({
  user: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

io.on('connection', async (socket) => {
  try {
    // Retrieve messages from the database and send them to the connected client
    const messages = await Message.find({}).exec();
    socket.emit('chat history', messages);
  } catch (err) {
    console.error(err);
  }

  socket.on('chat message', async (msg) => {
    try {
      const newMessage = new Message({ user: msg.user, text: msg.text });
      await newMessage.save();

      // Broadcast the message to all connected clients
      io.emit('chat message', { user: msg.user, text: msg.text });
    } catch (err) {
      console.error(err);
    }
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
