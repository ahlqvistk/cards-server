const getFromCardsToDeal = require('./get-from-cards-to-deal');

const cardsToDeal = [
  'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8',
  'c9', 'c10', 'cJ', 'cQ', 'cK', 'cA',
  'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8',
  'd9', 'd10', 'dJ', 'dQ', 'dK', 'dA',
  'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8',
  'h9', 'h10', 'hJ', 'hQ', 'hK', 'hA', 's2',
];

test('should get correct cards', () => {
  const nrOfPlayers = 4;
  const dealOrder = 0;
  const expectedCards = [
    'c2', 'c6', 'c10', 'cA', 'd5', 'd9', 'dK', 'h4', 'h8', 'hQ',
  ];

  expect(getFromCardsToDeal(cardsToDeal, nrOfPlayers, dealOrder))
    .toEqual(expectedCards);
});

test('should get correct cards', () => {
  const nrOfPlayers = 8;
  const dealOrder = 3;
  const expectedCards = ['c5', 'cK', 'd8', 'h3', 'hJ'];

  expect(getFromCardsToDeal(cardsToDeal, nrOfPlayers, dealOrder))
    .toEqual(expectedCards);
});
