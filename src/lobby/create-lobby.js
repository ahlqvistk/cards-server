const createSocketAction$ = require('../create-socket-action-stream');

module.exports = function createLobby(io, lobby) {
  const nsp = io.of('/');
  const socketAction$ = createSocketAction$(nsp);

  socketAction$.observe(({type, payload}) => {
    if (type === 'player connected') {
      payload.socket.emit('lobby', lobby);
    }
  });
};
