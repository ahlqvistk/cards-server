const removeKeys = require('./func/remove-keys');

module.exports = function personalizeState(id, state) {
  const keysToHide = [];
  const players = state.players.map((socket) => socket.id);

  return {...removeKeys(keysToHide, state), id, players};
};
