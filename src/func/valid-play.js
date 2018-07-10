const nextPlayer = require('./next-player');

module.exports = function validPlay(playedCard, state) {
  const currentPlayersHand = state.players.filter((player) => {
    return player.socket.id === state.activePlayer;
  })[0].cards;

  // !!! Set startingPlayer in state
  const firstPlayer = nextPlayer(state.dealer, state.players);

  // If it's the first players turn, any card on hand is allowed
  if (state.activePlayer === firstPlayer) {
    return currentPlayersHand.includes(playedCard);
  }

  // Other players need to follow suit if possible
  /*
  const currentSuit = state.players.filter((player) => {
    return player.socket.id === firstPlayer;
  })[0].playedCard;
  */
};
