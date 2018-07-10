const nextPlayer = require('./next-player');

test('should return the next player', () => {
  const players = [
    {socket: {id: 'a'}},
    {socket: {id: 'b'}},
    {socket: {id: 'c'}},
    {socket: {id: 'd'}},
  ];

  expect(nextPlayer('a', players)).toEqual('b');
  expect(nextPlayer('b', players)).toEqual('c');
  expect(nextPlayer('c', players)).toEqual('d');
  expect(nextPlayer('d', players)).toEqual('a');
});
