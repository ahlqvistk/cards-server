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
app.use('/table/:tableId', express.static(publicPath));
app.get('/create/:tableId', (req, res) => {
  const tableId = req.params.tableId;

  if (tables.hasOwnProperty(tableId)) {
    res.send('Table already exists.');
    return;
  }

  console.log('Creating table', tableId);
  const action$ = createTable(tableId, io);

  createTableActionEvents(tableId, tableEvents, action$);

  tables[tableId] = 'created';
  res.send(`Table ${tableId} created.`);
});
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log('listening on *:' + port);
});
