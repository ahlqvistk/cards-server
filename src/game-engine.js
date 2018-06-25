module.exports = function gameEngine(state, add) {
  if (!state.creator && state.players.length) {
    add({
      type: 'add creator',
      payload: {creator: state.players[0].id},
    });
  }
};
