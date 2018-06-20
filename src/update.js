module.exports = function update(state, {type, payload}) {
  console.log('action:', type);
  switch (type) {
  case 'player connected': {
    if (state.players.length >= 4) {
      return state;
    }
    const players = state.players.concat([payload.socket]);
    return {...state, players};
  }
  case 'player disconnected': {
    const players = state.players.filter((socket) => {
      return socket.id !== payload.socketId;
    });
    return {...state, players};
  }
  default:
    return state;
  }
};
