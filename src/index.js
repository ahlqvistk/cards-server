const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const createRoom = require('./create-room');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

let rooms = {};

const publicPath = process.env.CARDS_PUBLIC ?
  path.join(__dirname, process.env.CARDS_PUBLIC) :
  path.join(__dirname, 'public');

app.use('/', express.static(publicPath));
app.use('/room/:room', express.static(publicPath));
app.get('/create/room/:room', (req, res) => {
  const room = req.params.room;

  if (rooms.hasOwnProperty(room)) {
    res.send('Room already exists.');
    return;
  }

  console.log('Creating room', room);
  createRoom(room, io);
  rooms[room] = 'created';
  res.send(`Room ${room} created.`);
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log('listening on *:' + port);
});
