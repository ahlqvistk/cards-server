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
const personalizeState = require('./personalize-state');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicPath = process.env.CARDS_PUBLIC ?
  path.join(__dirname, process.env.CARDS_PUBLIC) : 'public';
app.use(express.static(publicPath));

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log('listening on *:' + port);
});

const {attach, stream} = proxy();
const gameEngineAction$ = createGameEngineAction$(stream);
const socketAction$ = createSocketAction$(io);
const action$ = most.merge(gameEngineAction$, socketAction$);
const state$ = createState$(action$);
attach(state$);

state$.skipRepeatsWith(deepEqual).observe((state) => {
  if (state.players.length) {
    state.players.forEach((player) => {
      player.socket.emit('state', personalizeState(player.socket.id, state));
    });
  }
});
