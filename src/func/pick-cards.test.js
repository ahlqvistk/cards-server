const pickCards = require('./pick-cards');

const deck = {
  status: 'shuffled',
  cards: [
    'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8',
    'c9', 'c10', 'cJ', 'cQ', 'cK', 'cA',
    'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8',
    'd9', 'd10', 'dJ', 'dQ', 'dK', 'dA',
    'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8',
    'h9', 'h10', 'hJ', 'hQ', 'hK', 'hA',
    's2', 's3', 's4', 's5', 's6', 's7', 's8',
    's9', 's10', 'sJ', 'sQ', 'sK', 'sA',
  ],
};

test('should return correct cards', () => {
  const expected = {
    cards: ['c2', 'c3', 'c4'],
    deck: {
      status: 'shuffled',
      cards: [
        'c5', 'c6', 'c7', 'c8',
        'c9', 'c10', 'cJ', 'cQ', 'cK', 'cA',
        'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8',
        'd9', 'd10', 'dJ', 'dQ', 'dK', 'dA',
        'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8',
        'h9', 'h10', 'hJ', 'hQ', 'hK', 'hA',
        's2', 's3', 's4', 's5', 's6', 's7', 's8',
        's9', 's10', 'sJ', 'sQ', 'sK', 'sA',
      ],
    },
  };

  expect(pickCards(3, deck)).toEqual(expected);
});
