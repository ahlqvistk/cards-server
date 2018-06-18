const express = require('express');
const http = require('http');
const most = require('most');
const {create} = require('@most/create');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicPath = process.env.PUBLIC || 'public';
app.use(express.static(path.join(__dirname, publicPath)));

let state = {
  players: [],
};

function update(state, event) {
  switch (event.event) {
  case 'player connected': {
    const players = state.players.concat([event.socket]);
    return {...state, players};
  }
  case 'player disconnected': {
    const players = state.players.filter((socket) => socket.id !== event.id);
    return {...state, players};
  }
  default:
    return state;
  }
}

function personalizeState(state) {
  const players = state.players.map((socket) => socket.id);
  return {...state, players};
}

function createEvent$(io) {
  const socket$ = most.fromEvent('connection', io);

  const connect$ = socket$.map((socket) => ({
    event: 'player connected',
    socket,
  }));

  const disconnect$ = create((add, end, error) => {
    socket$.observe((socket) => {
      socket.on('disconnect', () => {
        add({
          event: 'player disconnected',
          id: socket.id,
        });
      });
    });
  });

  const action$ = create((add, end, error) => {
    socket$.observe((socket) => {
      socket.on('action', (data) => {
        add({
          event: data.event,
          id: socket.id,
          data,
        });
      });
    });
  });

  return most.merge(connect$, disconnect$, action$);
}

function createState$(event$) {
  return create((add, end, error) => {
    event$.observe((event) => {
      state = update(state, event);
      add(state);
    });
  });
}

const event$ = createEvent$(io);
const state$ = createState$(event$);

state$.observe((state) => {
  if (state.players.length) {
    state.players.forEach((socket) => {
      socket.emit('state', personalizeState(state));
    });
  }
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
