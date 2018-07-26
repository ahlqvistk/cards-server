const deepEqual = require('deep-equal');
const most = require('most');
const {proxy} = require('most-proxy');

const createGameEngineAction$ = require('./create-game-engine-action-stream');
const createSocketAction$ = require('./create-socket-action-stream');
const createTable$ = require('./create-table-stream');
const personalizeTable = require('./personalize-table');

module.exports = function createTable(tableId, io) {
  let table = {
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

  const nsp = io.of(`/table/${tableId}/`);
  const {attach, stream} = proxy();
  const gameEngineAction$ = createGameEngineAction$(stream);
  const socketAction$ = createSocketAction$(nsp);
  const action$ = most.merge(gameEngineAction$, socketAction$);
  const table$ = createTable$(table, action$);
  attach(table$);

  table$.skipRepeatsWith(deepEqual).observe((table) => {
    if (table.players.length) {
      table.players.forEach((player) => {
        player.socket.emit('table', personalizeTable(player.socket.id, table));
      });
    }
  });
};
