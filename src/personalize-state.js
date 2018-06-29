const removeKeys = require('./func/remove-keys');

module.exports = function personalizeState(id, state) {
  const keysToHide = ['deck'];
  const players = state.players.map((player) => player.socket.id);

  return {...removeKeys(keysToHide, state), id, players};
};
