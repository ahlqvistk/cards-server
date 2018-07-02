const dealCards = require('./deal-cards');

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

const players = [
  {
    socket: {id: 'a'},
  },
  {
    socket: {id: 'b'},
  },
  {
    socket: {id: 'c'},
  },
  {
    socket: {id: 'd'},
  },
];

test('should return same data, except cards', () => {
  const nrOfCards = 10;
  const dealer = 'a';
  const {newDeck, newPlayers} = dealCards(nrOfCards, dealer, deck, players);

  expect(newPlayers.map((player) => {
    const newPlayer = Object.assign({}, player);
    delete newPlayer.cards;
    return newPlayer;
  })).toEqual(players);

  expect(newDeck.status).toEqual(deck.status);
});

test('should deal cards', () => {
  const nrOfCards = 10;
  const dealer = 'c';
  const {newDeck, newPlayers} = dealCards(nrOfCards, dealer, deck, players);

  expect(newDeck.cards).toEqual([
    's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 'sJ', 'sQ', 'sK', 'sA',
  ]);

  expect(newPlayers).toEqual([
    {
      socket: {id: 'a'},
      cards: ['c3', 'c7', 'cJ', 'd2', 'd6', 'd10', 'dA', 'h5', 'h9', 'hK'],
    },
    {
      socket: {id: 'b'},
      cards: ['c4', 'c8', 'cQ', 'd3', 'd7', 'dJ', 'h2', 'h6', 'h10', 'hA'],
    },
    {
      socket: {id: 'c'},
      cards: ['c5', 'c9', 'cK', 'd4', 'd8', 'dQ', 'h3', 'h7', 'hJ', 's2'],
    },
    {
      socket: {id: 'd'},
      cards: ['c2', 'c6', 'c10', 'cA', 'd5', 'd9', 'dK', 'h4', 'h8', 'hQ'],
    },
  ]);
});
