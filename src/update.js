module.exports = function update(state, action) {
  switch (action.type) {
  case 'player connected': {
    const players = state.players.concat([action.payload]);
    return {...state, players};
  }
  case 'player disconnected': {
    const players = state.players.filter((socket) => {
      return socket.id !== action.payload;
    });
    return {...state, players};
  }
  default:
    return state;
  }
};
