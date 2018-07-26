const deepEqual = require('deep-equal');
const most = require('most');
const {proxy} = require('most-proxy');

const createGameEngineAction$ = require('./create-game-engine-action-stream');
const createSocketAction$ = require('./create-socket-action-stream');
const createState$ = require('./create-state-stream');
const personalizeState = require('./personalize-state');

module.exports = function createTable(table, io) {
  let state = {
    activePlayer: '',
    creator: '',
    dealer: '',
    deck: {
      status: '',
      cards: [],
    },
    leadingPlayer: '',
    players: [/*
      {
        bid: Int,
        cards: [],
        playedCard: '',
        socket: Socket,
      }
  */],
    round: 0,
    status: 'waiting for players',
    trickWinner: '',
    trump: '',
  };

  const nsp = io.of('/table/' + table + '/');
  const {attach, stream} = proxy();
  const gameEngineAction$ = createGameEngineAction$(stream);
  const socketAction$ = createSocketAction$(nsp);
  const action$ = most.merge(gameEngineAction$, socketAction$);
  const state$ = createState$(state, action$);
  attach(state$);

  state$.skipRepeatsWith(deepEqual).observe((state) => {
    if (state.players.length) {
      state.players.forEach((player) => {
        player.socket.emit('table', personalizeState(player.socket.id, state));
      });
    }
  });
};
