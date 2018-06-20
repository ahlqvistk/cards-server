const deepEqual = require('deep-equal');
const express = require('express');
const http = require('http');
const most = require('most');
const {proxy} = require('most-proxy');
const path = require('path');
const socketio = require('socket.io');

const createGameEngineAction$ = require('./create-game-engine-action-stream');
const createSocketAction$ = require('./create-socket-action-stream');
const createState$ = require('./create-state-stream');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicPath = process.env.PUBLIC || 'public';
app.use(express.static(path.join(__dirname, publicPath)));

function personalizeState(state) {
  const players = state.players.map((socket) => socket.id);
  return {...state, players};
}

const {attach, stream} = proxy();
const gameEngineAction$ = createGameEngineAction$(stream);
const socketAction$ = createSocketAction$(io);
const action$ = most.merge(gameEngineAction$, socketAction$);
const state$ = createState$(action$);
attach(state$);

state$.skipRepeatsWith(deepEqual).observe((state) => {
  if (state.players.length) {
    state.players.forEach((socket) => {
      socket.emit('state', personalizeState(state));
    });
  }
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
