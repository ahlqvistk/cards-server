const EventEmitter = require('events');
const express = require('express');
const http = require('http');
const most = require('most');
const path = require('path');
const socketio = require('socket.io');

const createLobby = require('./lobby/create-lobby');
const createTable = require('./table/create-table');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const tableEvents = new EventEmitter();

let lobby = {
  tables: [],
};

const lobby$ = most.fromEvent('event', tableEvents);
lobby$.observe((lobby) => console.log('tableEvent'));

const publicPath = process.env.CARDS_PUBLIC ?
  path.join(__dirname, process.env.CARDS_PUBLIC) :
  'public';

app.use('/', express.static(publicPath));
app.use('/table/:tableId', express.static(publicPath));
app.get('/create/:tableId', (req, res) => {
  const tableId = req.params.tableId;

  if (lobby.tables.map((table) => table.name).indexOf(tableId) >= 0) {
    res.send('Table already exists.');
    return;
  }

  console.log('Creating table', tableId);
  const {action$/* , table$ */} = createTable(tableId, io);

  action$.observe((action) => {
    if (['player connected', 'player disconnected'].includes(action.type)) {
      tableEvents.emit('event', {
        type: 'change number of players',
      // payload: name, numberOfPlayers
      });
    }

    if (action.type === 'client start game') {
      tableEvents.emit('event', {
        type: 'change status',
      // payload: name, status: 'game started'
      });
    }

    if (
      action.type === 'change status' &&
      action.payload === 'waiting for players'
    ) {
      tableEvents.emit('event', {
        type: 'change status',
      // payload: name, status: 'open'
      });
    }

    if (
      action.type === 'change status' &&
      action.payload === 'waiting to start game'
    ) {
      tableEvents.emit('event', {
        type: 'change status',
      // payload: 'closed'
      });
    }
  });

  lobby.tables.push({name: tableId});
  // type: add table
  // payload: name
  res.send(`Table ${tableId} created.`);
});

createLobby(io, lobby);

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log('listening on *:' + port);
});
