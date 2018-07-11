const createDeck = require('./func/create-deck');
const dealCards = require('./func/deal-cards');
const nextPlayer = require('./func/next-player');
const pickCards = require('./func/pick-cards');
const randomFromArray = require('./func/random-from-array');
const removeItemFromArray = require('./func/remove-item-from-array');
const shuffleArray = require('./func/shuffle-array');
const validBid = require('./func/valid-bid');
const validPlay = require('./func/valid-play');

module.exports = function update(state, {type, payload}) {
  console.log('action:', type);
  switch (type) {
  case 'player connected': {
    if (state.players.length >= 4) {
      return state;
    }
    const players = state.players.concat([{socket: payload.socket}]);
    return {...state, players};
  }
  case 'player disconnected': {
    const players = state.players.filter((player) => {
      return player.socket.id !== payload.socketId;
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
    return {...state, round: 1, status: 'shuffling'};
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
  case 'select random dealer and change status': {
    return {
      ...state,
      dealer: randomFromArray(state.players).socket.id,
      status: 'dealing',
    };
  }
  case 'select next dealer and change status': {
    const players = state.players.map((player) => player.socket.id);
    const index = players.indexOf(state.dealer);
    const nextIndex = (index + 1) % players.length;

    return {
      ...state,
      dealer: state.players[nextIndex].socket.id,
      status: 'dealing',
    };
  }
  case 'deal cards': {
    const dealer = state.dealer;
    const nrOfCards = payload.nrOfCards;
    const {newDeck, newPlayers} = dealCards(
      nrOfCards,
      dealer,
      state.deck,
      state.players
    );

    return {...state, deck: newDeck, players: newPlayers};
  }
  case 'pick trump card': {
    const {cards, deck} = pickCards(1, state.deck);

    return {...state, deck, trump: cards[0]};
  }
  case 'set active player': {
    return {...state, activePlayer: payload.activePlayer};
  }
  case 'client place bid': {
    if (validBid(payload.data.bid, state)) {
      const players = state.players.map((player) => {
        if (player.socket.id === payload.socketId) {
          return {...player, bid: payload.data.bid};
        }
        return player;
      });
      const activePlayer = nextPlayer(payload.socketId, players);
      return {...state, activePlayer, players};
    }
    return state;
  }
  case 'client play card': {
    if (validPlay(payload.data.playedCard, state)) {
      const players = state.players.map((player) => {
        if (player.socket.id === payload.socketId) {
          const playedCard = payload.data.playedCard;
          const cards = removeItemFromArray(playedCard, player.cards);
          return {...player, cards, playedCard};
        }
        const activePlayer = nextPlayer(payload.socketId, players);
        const leadingPlayer = state.leadingPlayer || payload.socketId;
        return {...state, activePlayer, players, leadingPlayer};
      });
    }
    return state;
  }
  default:
    return state;
  }
};
