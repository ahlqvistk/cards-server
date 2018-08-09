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

module.exports = function update(table, {type, payload}) {
  console.log('action:', type);
  switch (type) {
  case 'player connected': {
    if (table.players.length >= 4 ||
        table.type !== 'public' ||
        !['waiting for players', 'waiting to start game'].includes(table.status)
    ) {
      return table;
    }
    const players = table.players.concat([{socket: payload.socket}]);
    return {...table, players};
  }
  case 'client enter password': {
    if (table.players.length >= 4 ||
        payload.data.hash !== table.hash ||
        !['waiting for players', 'waiting to start game'].includes(table.status)
    ) {
      return table;
    }
    const players = table.players.concat([{socket: payload.socket}]);
    return {...table, players};
  }
  case 'player disconnected': {
    const players = table.players.filter((player) => {
      return player.socket.id !== payload.socketId;
    });
    if (payload.socketId === table.creator || !table.players.length) {
      return {...table, players, creator: ''};
    }
    return {...table, players};
  }
  case 'add creator': {
    return {...table, creator: payload.creator};
  }
  case 'change status': {
    console.log('\t', '-' + payload.status);
    return {...table, status: payload.status};
  }
  case 'client start game': {
    // add* ready to start check
    return {...table, round: 1, status: 'shuffling'};
  }
  case 'create deck': {
    const deck = {...table.deck, cards: createDeck()};
    return {...table, deck};
  }
  case 'shuffle deck': {
    const deck = {
      ...table.deck,
      cards: shuffleArray(table.deck.cards),
      status: 'shuffled',
    };
    return {...table, deck};
  }
  case 'select random dealer and change status': {
    return {
      ...table,
      dealer: randomFromArray(table.players).socket.id,
      status: 'dealing',
    };
  }
  case 'select next dealer and change status': {
    const players = table.players.map((player) => player.socket.id);
    const index = players.indexOf(table.dealer);
    const nextIndex = (index + 1) % players.length;

    return {
      ...table,
      dealer: table.players[nextIndex].socket.id,
      status: 'dealing',
    };
  }
  case 'deal cards': {
    const dealer = table.dealer;
    const nrOfCards = payload.nrOfCards;
    const {newDeck, newPlayers} = dealCards(
      nrOfCards,
      dealer,
      table.deck,
      table.players
    );

    return {...table, deck: newDeck, players: newPlayers};
  }
  case 'pick trump card': {
    const {cards, deck} = pickCards(1, table.deck);

    return {...table, deck, trump: cards[0]};
  }
  case 'set active player': {
    return {...table, activePlayer: payload.activePlayer};
  }
  case 'client place bid': {
    if (validBid(payload.data.bid, table)) {
      const players = table.players.map((player) => {
        if (player.socket.id === payload.socketId) {
          return {...player, bid: payload.data.bid};
        }
        return player;
      });
      const activePlayer = nextPlayer(payload.socketId, players);
      return {...table, activePlayer, players};
    }
    return table;
  }
  case 'client play card': {
    if (validPlay(payload.data.playedCard, table)) {
      const players = table.players.map((player) => {
        if (player.socket.id === payload.socketId) {
          const playedCard = payload.data.playedCard;
          const cards = removeItemFromArray(playedCard, player.cards);
          return {...player, cards, playedCard};
        }
        return player;
      });

      const activePlayer = nextPlayer(payload.socketId, table.players);
      const leadingPlayer = table.leadingPlayer || payload.socketId;
      return {...table, activePlayer, players, leadingPlayer};
    }
    return table;
  }
  case 'set trick winner': {
    // Add 1 trick to winning player
    const players = table.players.map((player) => {
      if (player.socket.id === payload.id) {
        const tricks = player.hasOwnProperty('tricks') ? player.tricks + 1 : 1;
        return {...player, tricks};
      }
      return {...player};
    });

    // Set trickWinner to winner
    return {
      ...table,
      players,
      trickWinner: payload.id,
    };
  }
  case 'reset trick and change status': {
    // Remove played cards
    const players = table.players.map((player) => {
      return {...player, playedCard: ''};
    });

    // Set active player and reset leading player and trick winner
    return {
      ...table,
      players,
      activePlayer: table.trickWinner,
      leadingPlayer: '',
      trickWinner: '',
      status: payload.status,
    };
  }
  case 'award points': {
    // award points and reset bids and tricks
    const players = table.players.map((player) => {
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
    const round = table.round + 1;
    const status = 'showing scoreboard';
    const trump = '';

    return {...table, activePlayer, players, round, status, trump};
  }
  case 'reset game': {
    const activePlayer = '';
    const dealer = '';
    const deck = {cards: [], status: ''};
    const leadingPlayer = '';
    const players = table.players.map((player) => ({socket: player.socket}));
    const round = 0;
    const status = 'waiting for players';
    const trickWinner = '';
    const trump = '';

    return {
      ...table,
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
    return table;
  }
};
