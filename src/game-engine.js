/* globals Promise */
const {
  getPlayerIndexFromId,
  getWinningCardIndex,
} = require('cards-common');

module.exports = function gameEngine(state) {
  return new Promise((resolve) => {
    // Reset game
    if (state.players.length < 4 && state.status !== 'waiting for players') {
      resolve({
        type: 'reset game',
      });
    }

    switch (state.status) {
    case 'waiting for players':
      // First that joins becomes creator
      if (!state.creator && state.players.length) {
        resolve({
          type: 'add creator',
          payload: {creator: state.players[0].socket.id},
        });
      }
      // When 4 players has joined, change status
      if (state.players.length === 4) {
        resolve({
          type: 'change status',
          payload: {status: 'waiting to start game'},
        });
      }
      break;
    case 'waiting to start game':
      // If player leaves change status to waiting for players
      if (state.players.length < 4) {
        resolve({
          type: 'change status',
          payload: {status: 'waiting for players'},
        });
      }
      break;
    case 'shuffling':
      // create deck
      if (state.deck.cards.length !== 52) {
        resolve({
          type: 'create deck',
        });
      }
      // shuffle deck, then change status to dealing
      if (state.deck.status !== 'shuffled') {
        resolve({
          type: 'shuffle deck',
        });
      } else {
        resolve({
          type: 'change status',
          payload: {status: 'selecting dealer'},
        });
      }
      break;
    case 'selecting dealer':
      // select dealer, random round 1, then next
      if (state.round <= 1 && !state.dealer) {
        resolve({
          type: 'select random dealer and change status',
        });
      }

      resolve({
        type: 'select next dealer and change status',
      });
      break;
    case 'dealing':
      // deal cards, round determines how many
      if (!state.players[0].hasOwnProperty('cards') ||
          !state.players[0].cards.length
      ) {
        const nrOfCards = state.round <= 10 ?
          10 - state.round + 1 :
          state.round - 9;

        resolve({
          type: 'deal cards',
          payload: {
            nrOfCards,
          },
        });
      }
      // select trump card
      if (!state.trump) {
        resolve({
          type: 'pick trump card',
        });
      }
      if (!state.activePlayer) {
        // Get player after dealer
        const activePlayerIndex = (state.players
          .map((player, index) => ({id: player.socket.id, index}))
          .filter((player) => player.id === state.dealer)
          .map((player) => player.index)[0] + 1
        ) % state.players.length;
        const activePlayer = state.players[activePlayerIndex].socket.id;
        resolve({
          type: 'set active player',
          payload: {
            activePlayer,
          },
        });
      }
      // change status to bidding
      resolve({
        type: 'change status',
        payload: {status: 'bidding'},
      });
      break;
    case 'bidding':
      // If all players has made a bid, change status to playing
      if (state.players.filter((player) => (
        player.hasOwnProperty('bid') && player.bid >= 0
      )).length === state.players.length) {
        resolve({
          type: 'change status',
          payload: {status: 'playing'},
        });
      }
      break;
    case 'playing':
      // When all players have played their cards, change status to check winner
      if (state.players.filter((player) => (
        player.hasOwnProperty('playedCard') && player.playedCard
      )).length === state.players.length) {
        resolve({
          type: 'change status',
          payload: {status: 'checking trick winner'},
        });
      }
      break;
    case 'checking trick winner': {
      if (!state.trickWinner) {
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
        resolve({
          type: 'set trick winner',
          payload: {id: winningPlayer},
        });
      }
      const status = state.players[0].cards.length ?
        'playing' :
        'awarding points';
      // Wait 5 seconds before changing status
      setTimeout(() => resolve({
        type: 'reset trick and change status',
        payload: {status},
      }), 5000);
      break;
    }
    case 'awarding points':
      resolve({
        type: 'award points',
      });
      break;
    case 'showing scoreboard': {
      const status = state.round < 20 ? 'shuffling': 'ending game';
      // Wait 7 seconds before changing status
      setTimeout(() => resolve({
        type: 'change status',
        payload: {status},
      }), 7000);
      break;
    }
    default:
      break;
    }
  });
};
