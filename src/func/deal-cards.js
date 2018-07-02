const getDealOrder = require('./get-deal-order');
const getFromCardsToDeal = require('./get-from-cards-to-deal');

module.exports = function dealCards(nrOfCards, dealer, deck, players) {
  const cardsToDeal = deck.cards.slice(0, nrOfCards * players.length);
  const remainingCards = deck.cards.slice(nrOfCards * players.length);

  const newPlayers = players.map((player) => {
    const cards = getFromCardsToDeal(
      cardsToDeal,
      players.length,
      getDealOrder(dealer, player.socket.id, players)
    );

    return {...player, cards};
  });

  return {newDeck: {...deck, cards: remainingCards}, newPlayers};
};
