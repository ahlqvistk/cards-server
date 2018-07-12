const gameEngine = require('./game-engine');

describe('checking trick winner', () => {
  const state = {
    leadingPlayer: 'a',
    players: [
      {cards: ['c2'], playedCard: 'hQ', socket: {id: 'a'}},
      {cards: ['d2'], playedCard: 's10', socket: {id: 'b'}},
      {cards: ['h2'], playedCard: 'h5', socket: {id: 'c'}},
      {cards: ['s2'], playedCard: 'hA', socket: {id: 'd'}},
    ],
    status: 'checking trick winner',
    trump: 's7',
  };

  const actionObject = {
    type: 'set trick winner and change status',
    payload: {id: 'b'},
  };

  test('should return the correct action object', () => {
    expect(gameEngine(state)).toEqual(actionObject);
  });
});
