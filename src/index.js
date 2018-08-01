const EventEmitter = require('events');
const express = require('express');
const http = require('http');
const most = require('most');
const path = require('path');
const socketio = require('socket.io');

const createSocketAction$ = require('./create-socket-action-stream');
const createState$ = require('./create-state-stream');
const createTable = require('./table/create-table');
const update = require('./lobby/update');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const tableEvents = new EventEmitter();

let lobby = {
  tables: [],
};

const nsp = io.of('/');
const tableAction$ = most.fromEvent('event', tableEvents);
const socketAction$ = createSocketAction$(nsp);
const action$ = most.merge(tableAction$, socketAction$);
const lobby$ = createState$(lobby, action$, update);

lobby$.observe((lobby) => {
  io.of('/').emit('lobby', lobby);
});

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
  let {action$} = createTable(tableId, io);

  action$.observe((action) => {
    if (action.type === 'player connected') {
      tableEvents.emit('event', {
        type: 'player joined table',
        payload: {
          name: tableId,
        },
      });
    }

    if (action.type === 'player disconnected') {
      tableEvents.emit('event', {
        type: 'player left table',
        payload: {
          name: tableId,
        },
      });
    }

    if (action.type === 'client start game') {
      tableEvents.emit('event', {
        type: 'table changed status',
      // payload: name, status: 'game started'
      });
    }

    if (
      action.type === 'change status' &&
      action.payload === 'waiting for players'
    ) {
      tableEvents.emit('event', {
        type: 'table changed status',
      // payload: name, status: 'open'
      });
    }

    if (
      action.type === 'change status' &&
      action.payload === 'waiting to start game'
    ) {
      tableEvents.emit('event', {
        type: 'table changed status',
      // payload: 'closed'
      });
    }
  });

  tableEvents.emit('event', {
    type: 'add table',
    payload: {
      name: tableId,
    },
  });

  res.send(`Table ${tableId} created.`);
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log('listening on *:' + port);
});
