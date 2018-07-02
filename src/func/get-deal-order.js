module.exports = function getDealOrder(dealer, playerId, players) {
  function getPlacement(players, id) {
    return players
      .map((player, index) => ({id: player.socket.id, placement: index}))
      .filter((player) => player.id === id)
      .map((player) => player.placement)[0];
  }

  const dealerPlacement = getPlacement(players, dealer);
  const playerPlacement = getPlacement(players, playerId);

  return (
    (playerPlacement - dealerPlacement) + players.length - 1
  ) % players.length;
};
