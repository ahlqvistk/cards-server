module.exports = function createDeck() {
  const suits = ['c', 'd', 'h', 's'];
  const rank = [
    '2', '3', '4', '5', '6', '7', '8',
    '9', '10', 'J', 'Q', 'K', 'A',
  ];

  return suits.map((suit) => rank.map((rank) => suit + rank))
    .reduce((acc, val) => acc.concat(val));
};
