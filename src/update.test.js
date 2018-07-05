const update = require('./update');

describe('player connected', () => {
  const action = {
    type: 'player connected',
    payload: {
      socket: '4',
    },
  };
  const state = {
    players: [
      {socket: '1'},
      {socket: '2'},
      {socket: '3'},
    ],
  };
  const actual = update(state, action);
  const expected = {
    players: [
      {socket: '1'},
      {socket: '2'},
      {socket: '3'},
      {socket: '4'},
    ],
  };

  test('should add player to players', () => {
    expect(actual).toEqual(expected);
  });

  test('should return the same state if players > 4', () => {
    expect(update(expected, action)).toEqual(expected);
  });
});

describe('player disconnected', () => {
  const action = {
    type: 'player disconnected',
    payload: {
      socketId: '3',
    },
  };
  const state = {
    players: [
      {socket: {id: '1'}},
      {socket: {id: '2'}},
      {socket: {id: '3'}},
      {socket: {id: '4'}},
    ],
  };
  const actual = update(state, action);
  const expected = {
    players: [
      {socket: {id: '1'}},
      {socket: {id: '2'}},
      {socket: {id: '4'}},
    ],
  };

  test('should remove player from players', () => {
    expect(actual).toEqual(expected);
  });
});

describe('add creator', () => {
  const action = {
    type: 'add creator',
    payload: {
      creator: 'abc',
    },
  };
  const state = {
    creator: '',
  };
  const actual = update(state, action);
  const expected = {
    creator: 'abc',
  };
  test('should add creator', () => {
    expect(actual).toEqual(expected);
  });
});

describe('change status', () => {
  const action = {
    type: 'change status',
    payload: {
      status: 'new status',
    },
  };
  const state = {
    status: 'old status',
  };
  const actual = update(state, action);
  const expected = {
    status: 'new status',
  };
  test('should change the status', () => {
    expect(actual).toEqual(expected);
  });
});

describe('client start game', () => {
  const action = {
    type: 'client start game',
  };
  const state = {
    other: 'other data',
    round: 0,
    status: 'old status',
  };
  const actual = update(state, action);
  const expected = {
    other: 'other data',
    round: 1,
    status: 'shuffling',
  };
  test('should change status to shuffling and round to 1', () => {
    expect(actual).toEqual(expected);
  });
});

describe('create deck', () => {
  const action = {
    type: 'create deck',
  };
  const state = {
    deck: {
      cards: [],
      status: '',
    },
  };
  const actual = update(state, action);
  const expected = {
    deck: {
      cards: [
        'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'cJ', 'cQ',
        'cK', 'cA', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10',
        'dJ', 'dQ', 'dK', 'dA', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8',
        'h9', 'h10', 'hJ', 'hQ', 'hK', 'hA', 's2', 's3', 's4', 's5', 's6',
        's7', 's8', 's9', 's10', 'sJ', 'sQ', 'sK', 'sA',
      ],
      status: '',
    },
  };
  test('should return a full deck', () => {
    expect(actual).toEqual(expected);
  });
});

describe('shuffle deck', () => {
  const action = {
    type: 'shuffle deck',
  };
  const state = {
    other: 'other data',
    deck: {
      cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      status: '',
    },
  };
  const actual = update(state, action);
  test('should change deck status and shuffle the array', () => {
    expect(actual.deck.status).toEqual('shuffled');
    expect(actual.deck.cards).not.toEqual(state.deck.cards);
  });
});

describe('select random dealer', () => {
  const action = {
    type: 'select random dealer and change status',
  };
  const state = {
    other: 'other data',
    dealer: '',
    players: [
      {socket: {id: '1'}},
      {socket: {id: '2'}},
      {socket: {id: '3'}},
      {socket: {id: '4'}},
    ],
  };
  const actual = update(state, action);
  test('should select a dealer', () => {
    expect(actual.players).toEqual(state.players);
    expect(actual.dealer).not.toEqual(state.dealer);
  });
});

describe('select next dealer', () => {
  const action = {
    type: 'select next dealer and change status',
  };
  const state = {
    other: 'other data',
    dealer: '4',
    players: [
      {socket: {id: '1'}},
      {socket: {id: '2'}},
      {socket: {id: '3'}},
      {socket: {id: '4'}},
    ],
  };
  const actual = update(state, action);
  test('should select the next dealer', () => {
    expect(actual.dealer).toEqual('1');
    expect(update(actual, action).dealer).toEqual('2');
  });
});
