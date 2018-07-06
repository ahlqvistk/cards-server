const {create} = require('@most/create');

const update = require('./update');

let state = {
  activePlayer: '',
  creator: '',
  dealer: '',
  deck: {
    status: '',
    cards: [],
  },
  players: [/*
    {
      bid: Int,
      cards: [],
      socket: Socket,
    }
*/],
  round: 0,
  status: 'waiting for players',
  trump: '',
};

module.exports = function createState$(action$) {
  return create((add, end, error) => {
    action$.observe((action) => {
      state = update(state, action);
      add(state);
    });
  });
};
