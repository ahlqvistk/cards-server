module.exports = function personalizeState(id, state) {
  const players = state.players.map((socket) => socket.id);
  return {...state, id, players};
};
