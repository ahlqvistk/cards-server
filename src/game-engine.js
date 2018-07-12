const common = '../../cards-common/src/';
const getPlayerIndexFromId = require(common + 'get-player-index-from-id');
const getWinningCardIndex = require(common + 'get-winning-card-index');

module.exports = function gameEngine(state) {
  switch (state.status) {
  case 'waiting for players':
    // First that joins becomes creator
    if (!state.creator && state.players.length) {
      return {
        type: 'add creator',
        payload: {creator: state.players[0].socket.id},
      };
    }
    // When 4 players has joined, change status
    if (state.players.length === 4) {
      return {
        type: 'change status',
        payload: {status: 'waiting to start game'},
      };
    }
    break;
  case 'waiting to start game':
    // If player leaves change status to waiting for players
    if (state.players.length < 4) {
      return {
        type: 'change status',
        payload: {status: 'waiting for players'},
      };
    }
    break;
  case 'shuffling':
    // create deck
    if (state.deck.cards.length !== 52) {
      return {
        type: 'create deck',
      };
    }
    // shuffle deck, then change status to dealing
    if (state.deck.status !== 'shuffled') {
      return {
        type: 'shuffle deck',
      };
    } else {
      return {
        type: 'change status',
        payload: {status: 'selecting dealer'},
      };
    }
  case 'selecting dealer':
    // select dealer, random round 1, then next
    if (state.round <= 1 && !state.dealer) {
      return {
        type: 'select random dealer and change status',
      };
    }

    return {
      type: 'select next dealer and change status',
    };
  case 'dealing':
    // deal cards, round determines how many
    if (!state.players[0].hasOwnProperty('cards') ||
        !state.players[0].cards.length
    ) {
      const nrOfCards = state.round <= 10 ?
        10 - state.round + 1 :
        state.round - 10;

      return {
        type: 'deal cards',
        payload: {
          nrOfCards,
        },
      };
    }
    // select trump card
    if (!state.trump) {
      return {
        type: 'pick trump card',
      };
    }
    if (!state.activePlayer) {
      // Get player after dealer
      const activePlayerIndex = (state.players
        .map((player, index) => ({id: player.socket.id, index}))
        .filter((player) => player.id === state.dealer)
        .map((player) => player.index)[0] + 1
      ) % state.players.length;
      const activePlayer = state.players[activePlayerIndex].socket.id;
      return {
        type: 'set active player',
        payload: {
          activePlayer,
        },
      };
    }
    // change status to bidding
    return {
      type: 'change status',
      payload: {status: 'bidding'},
    };
  case 'bidding':
    // If all players has made a bid, change status to playing
    if (state.players.filter((player) => (
      player.hasOwnProperty('bid') && player.bid >= 0
    )).length === state.players.length) {
      return {
        type: 'change status',
        payload: {status: 'playing'},
      };
    }
    break;
  case 'playing':
    // When all players have played their cards, change status to check winner
    if (state.players.filter((player) => (
      player.hasOwnProperty('playedCard') && player.playedCard
    )).length === state.players.length) {
      return {
        type: 'change status',
        payload: {status: 'checking trick winner'},
      };
    }
    break;
  case 'checking trick winner': {
    const leadingPlayerIndex = getPlayerIndexFromId(
      state.leadingPlayer,
      state.players
    );
    const playedCards = state.players.map((player) => player.playedCard);
    const leadingCard = playedCards[leadingPlayerIndex];
    const winningCardIndex = getWinningCardIndex(
      leadingCard,
      state.trump,
      playedCards
    );
    const winningPlayer = state.players[winningCardIndex].socket.id;
    return {
      type: 'set trick winner and change status',
      payload: {id: winningPlayer},
    };
  }
  case 'awarding points':
    return {
      type: 'award points',
    };
  default:
    break;
  }
};
