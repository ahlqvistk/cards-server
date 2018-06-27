const createDeck = require('./func/create-deck.js');
const randomFromArray = require('./func/random-from-array');
const shuffleArray = require('./func/shuffle-array.js');

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
    console.log('\t', '-' + payload.status);
    return {...state, status: payload.status};
  }
  case 'client start game': {
    // add* ready to start check
    return {...state, round: 1, status: 'shuffle'};
  }
  case 'create deck': {
    const deck = {...state.deck, cards: createDeck()};
    return {...state, deck};
  }
  case 'shuffle deck': {
    const deck = {
      ...state.deck,
      cards: shuffleArray(state.deck.cards),
      status: 'shuffled',
    };
    return {...state, deck};
  }
  case 'select random dealer': {
    return {...state, dealer: randomFromArray(state.players).id};
  }
  default:
    return state;
  }
};
