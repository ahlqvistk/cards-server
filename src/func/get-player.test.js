const getPlayer = require('./get-player');

const state = {
  players: [
    {cards: ['s2', 's3'], socket: {id: 'a'}},
    {cards: ['h2', 'h3'], socket: {id: 'b'}},
    {cards: ['d2', 'd3'], socket: {id: 'c'}},
    {cards: ['c2', 'c3'], socket: {id: 'd'}},
  ],
};

test('should return the correct player object', () => {
  expect(getPlayer('a', state.players)).toEqual(state.players[0]);
  expect(getPlayer('b', state.players)).toEqual(state.players[1]);
  expect(getPlayer('c', state.players)).toEqual(state.players[2]);
  expect(getPlayer('d', state.players)).toEqual(state.players[3]);
});
