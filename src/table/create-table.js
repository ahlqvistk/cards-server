const deepEqual = require('deep-equal');
const most = require('most');
const {proxy} = require('most-proxy');

const createGameEngineAction$ = require('./create-game-engine-action-stream');
const createSocketAction$ = require('../create-socket-action-stream');
const createState$ = require('../create-state-stream');
const personalizeTable = require('./personalize-table');
const update = require('./update');

module.exports = function createTable(tableId, io, hash) {
  const table = {
    activePlayer: '',
    creator: '',
    dealer: '',
    deck: {
      status: '',
      cards: [],
    },
    hash,
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

  const nsp = io.of(`/table/${tableId}/`);
  const {attach, stream} = proxy();
  const gameEngineAction$ = createGameEngineAction$(stream);
  const socketAction$ = createSocketAction$(nsp);
  const action$ = most.merge(gameEngineAction$, socketAction$);
  const table$ = createState$(table, action$, update);
  attach(table$);

  table$.skipRepeatsWith(deepEqual).observe((table) => {
    if (table.players.length) {
      table.players.forEach((player) => {
        player.socket.emit('table', personalizeTable(player.socket.id, table));
      });
    }
  });

  return action$;
};
