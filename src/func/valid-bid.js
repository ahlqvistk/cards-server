module.exports = function validBid(bid, state) {
  const nrOfCards = state.players[0].cards.length;

  if (bid > nrOfCards || bid < 0) {
    return false;
  }

  if (state.activePlayer === state.dealer) {
    const currentBidTotal = state.players.reduce((acc, curr) => {
      return curr.hasOwnProperty('bid') && curr.bid ? acc + curr.bid : acc + 0;
    }, 0);

    if (currentBidTotal + bid === nrOfCards) {
      return false;
    }
  }

  return true;
};
