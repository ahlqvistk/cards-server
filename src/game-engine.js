module.exports = function gameEngine(state) {
  switch (state.status) {
  case 'waiting for players':
    // First that joins becomes creator
    if (!state.creator && state.players.length) {
      return {
        type: 'add creator',
        payload: {creator: state.players[0].id},
      };
    }
    // When 4 players has joined, change status
    if (state.players.length === 4) {
      return {
        type: 'change status',
        payload: {status: 'waiting to start game'},
      };
    }
    break;
  case 'waiting to start game':
    // If player leaves change status to waiting for players
    if (state.players.length < 4) {
      return {
        type: 'change status',
        payload: {status: 'waiting for players'},
      };
    }
    break;
  case 'shuffle':
    // create deck
    if (state.deck.cards.length !== 52) {
      return {
        type: 'create deck',
      };
    }
    // shuffle deck, then change status to dealing
    if (state.deck.status !== 'shuffled') {
      return {
        type: 'shuffle deck',
      };
    } else {
      return {
        type: 'change status',
        payload: {status: 'dealing'},
      };
    }
  case 'dealing':
    // select dealer, random round 1, then next
    if (state.round <= 1 && !state.dealer) {
      return {
        type: 'select random dealer',
      };
    } else if (state.round > 1) {
      return {
        type: 'select next dealer',
      };
    }
    // deal cards, round determines how many
    // change status to bidding
    break;
  default:
    break;
  }
};
