const {create} = require('@most/create');

const update = require('./update');

let state = {
  creator: '',
  deck: [],
  players: [],
  round: 0,
  status: 'waiting for players',
};

module.exports = function createState$(action$) {
  return create((add, end, error) => {
    action$.observe((action) => {
      state = update(state, action);
      add(state);
    });
  });
};
