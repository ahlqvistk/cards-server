module.exports = function nextPlayer(id, players) {
  const currentPlayerIndex = players
    .map((player, index) => ({id: player.socket.id, index}))
    .filter((player) => player.id === id)
    .map((player) => player.index)[0];

  const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;

  return players[nextPlayerIndex].socket.id;
};
