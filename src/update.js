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
    if (payload.socketId === state.creator || !state.players.length) {
      return {...state, players, creator: ''};
    }
    return {...state, players};
  }
  case 'add creator': {
    return {...state, creator: payload.creator};
  }
  case 'change status': {
    return {...state, status: payload.status};
  }
  default:
    return state;
  }
};
