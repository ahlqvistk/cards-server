module.exports = function getFromCardsToDeal(
  cardsToDeal, nrOfPlayers, dealOrder
) {
  return cardsToDeal.filter((card, index) => {
    return (index - dealOrder) % nrOfPlayers === 0;
  });
};
