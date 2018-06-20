module.exports = function gameEngine(state, add) {
  if (state.players.length === 4) {
    add({
      type: 'start game',
      payload: {},
    });
  }
};
