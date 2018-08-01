const most = require('most');

const createSocketAction$ = require('../create-socket-action-stream');
const createState$ = require('../create-state-stream');
const update = require('./update');

module.exports = function createTable(tableEvents, io) {
  const lobby = {
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
};
