const {
  createDeck,
  dealCards,
  nextPlayer,
  pickCards,
  randomFromArray,
  removeItemFromArray,
  shuffleArray,
  validBid,
  validPlay,
} = require('cards-common');

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
        return player;
      });

      const activePlayer = nextPlayer(payload.socketId, state.players);
      const leadingPlayer = state.leadingPlayer || payload.socketId;
      return {...state, activePlayer, players, leadingPlayer};
    }
    return state;
  }
  case 'set trick winner': {
    // Add 1 trick to winning player
    const players = state.players.map((player) => {
      if (player.socket.id === payload.id) {
        const tricks = player.hasOwnProperty('tricks') ? player.tricks + 1 : 1;
        return {...player, tricks};
      }
      return {...player};
    });

    // Set trickWinner to winner
    return {
      ...state,
      players,
      trickWinner: payload.id,
    };
  }
  case 'reset trick and change status': {
    // Remove played cards
    const players = state.players.map((player) => {
      return {...player, playedCard: ''};
    });

    // Set active player and reset leading player and trick winner
    return {
      ...state,
      players,
      activePlayer: state.trickWinner,
      leadingPlayer: '',
      trickWinner: '',
      status: payload.status,
    };
  }
  case 'award points': {
    // award points and reset bids and tricks
    const players = state.players.map((player) => {
      const tricks = player.hasOwnProperty('tricks') ? player.tricks : 0;
      const newPoints = player.bid === tricks ?
        [10 + tricks] :
        [tricks];

      const points = player.hasOwnProperty('points') ?
        player.points.concat(newPoints) :
        newPoints;

      return {...player, bid: -1, points, tricks: 0};
    });

    const activePlayer = '';
    const round = state.round + 1;
    const status = 'showing scoreboard';
    const trump = '';

    return {...state, activePlayer, players, round, status, trump};
  }
  case 'reset game': {
    const activePlayer = '';
    const dealer = '';
    const deck = {cards: [], status: ''};
    const leadingPlayer = '';
    const players = state.players.map((player) => ({socket: player.socket}));
    const round = 0;
    const status = 'waiting for players';
    const trickWinner = '';
    const trump = '';

    return {
      ...state,
      activePlayer,
      dealer,
      deck,
      leadingPlayer,
      players,
      round,
      status,
      trickWinner,
      trump,
    };
  }
  default:
    return state;
  }
};
