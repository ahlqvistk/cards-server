const EventEmitter = require('events');
const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const createTable = require('./table/create-table');
const createLobby = require('./lobby/create-lobby');
const createTableActionEvents = require('./create-table-action-events');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const tableEvents = new EventEmitter();

const tables = {};
createLobby(tableEvents, io);

const publicPath = process.env.CARDS_PUBLIC ?
  path.join(__dirname, process.env.CARDS_PUBLIC) :
  'public';

app.use('/', express.static(publicPath));
app.use('/table/:id', express.static(publicPath));
app.get('/create/:id', (req, res) => {
  const id = req.params.id;

  if (tables.hasOwnProperty(id)) {
    res.send('Table already exists.');
    return;
  }

  console.log('Creating table', id);
  const action$ = createTable(id, io);

  createTableActionEvents(id, tableEvents, action$);

  tables[id] = 'created';
  res.send(`Table ${id} created.`);
});
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log('listening on *:' + port);
});
