module.exports = function update(state, action) {
  switch (action.type) {
  case 'player connected': {
    if (state.players.length >= 4) {
      return state;
    }
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
