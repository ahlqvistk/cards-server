const orderArrayFromIndex = require('./func/order-array-from-index');
const removeKeys = require('./func/remove-keys');

module.exports = function personalizeState(id, state) {
  const keysToHide = ['deck'];
  const players = state.players.map((player) => {
    // Hide other players cards
    if (player.hasOwnProperty('cards')) {
      const cards = id === player.socket.id ?
        player.cards :
        player.cards.map((card) => 'back');
      return {...player, cards, socket: {id: player.socket.id}};
    }

    return {...player, socket: {id: player.socket.id}};
  });

  const currentPlayerIndex = players.map((player) => (
    player.socket.id
  )).indexOf(id);
  const orderedPlayers = orderArrayFromIndex(currentPlayerIndex, players);

  return {...removeKeys(keysToHide, state), id, players: orderedPlayers};
};
