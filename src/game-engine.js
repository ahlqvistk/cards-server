module.exports = function gameEngine(state, add) {
  switch (state.status) {
  case 'waiting for players':
    // First that joins becomes creator
    if (!state.creator && state.players.length) {
      add({
        type: 'add creator',
        payload: {creator: state.players[0].id},
      });
    }
    // When 4 players has joined, change status
    if (state.players.length === 4) {
      add({
        type: 'change status',
        payload: {status: 'waiting to start game'},
      });
    }
    break;
  case 'waiting to start game':
    // If player leaves change status to waiting for players
    if (state.players.length < 4) {
      add({
        type: 'change status',
        payload: {status: 'waiting for players'},
      });
    }
    break;
  case 'shuffle':
    // create deck
    if (state.deck.length !== 52) {
      add({
        type: 'create deck',
      });
    }
    // shuffle deck
    add({
      type: 'shuffle deck',
    });
    // change status to dealing
    add({
      type: 'change status',
      payload: {status: 'dealing'},
    });
    break;
  default:
    break;
  }
};
