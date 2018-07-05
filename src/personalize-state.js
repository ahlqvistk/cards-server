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

  return {...removeKeys(keysToHide, state), id, players};
};
