const createDeck = require('./create-deck');

test('returns an array', () => {
  expect(createDeck()).toEqual(expect.arrayContaining([]));
});

test('returns an array with length 52', () => {
  expect(createDeck()).toHaveLength(52);
});

test('returns correct cards', () => {
  expect(createDeck()).toEqual(expect.arrayContaining([
    'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8',
    'c9', 'c10', 'cJ', 'cQ', 'cK', 'cA',
    'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8',
    'd9', 'd10', 'dJ', 'dQ', 'dK', 'dA',
    'h2', 'h3', 'h4', 'h5', 'h6', 'h7',
    'h8', 'h9', 'h10', 'hJ', 'hQ', 'hK', 'hA',
    's2', 's3', 's4', 's5', 's6', 's7', 's8',
    's9', 's10', 'sJ', 'sQ', 'sK', 'sA',
  ]));
});
