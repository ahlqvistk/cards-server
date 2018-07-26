const {
  orderArrayFromIndex,
  removeKeys,
} = require('cards-common');

module.exports = function personalizeTable(id, table) {
  const keysToHide = ['deck'];
  const players = table.players.map((player) => {
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

  return {...removeKeys(keysToHide, table), id, players: orderedPlayers};
};
