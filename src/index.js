const express = require('express');
const http = require('http');
const {create} = require('@most/create');
const path = require('path');
const socketio = require('socket.io');

const createSocketAction$ = require('./create-socket-action-stream');
const update = require('./update');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicPath = process.env.PUBLIC || 'public';
app.use(express.static(path.join(__dirname, publicPath)));

let state = {
  players: [],
};

function personalizeState(state) {
  const players = state.players.map((socket) => socket.id);
  return {...state, players};
}

function createState$(action$) {
  return create((add, end, error) => {
    action$.observe((action) => {
      state = update(state, action);
      add(state);
    });
  });
}

const action$ = createSocketAction$(io);
const state$ = createState$(action$);

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
