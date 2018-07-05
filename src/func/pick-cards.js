module.exports = function pickCards(amount, deck) {
  const pickedCards = deck.cards.slice(0, amount);
  const remainingCards = deck.cards.slice(amount);

  return {cards: pickedCards, deck: {...deck, cards: remainingCards}};
};
