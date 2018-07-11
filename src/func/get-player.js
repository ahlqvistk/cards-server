module.exports = function getPlayer(id, players) {
  return players.filter((player) => {
    return player.socket.id === id;
  })[0];
};
