const {create} = require('@most/create');

const update = require('./update');

module.exports = function createState$(state, action$) {
  return create((add, end, error) => {
    action$.observe((action) => {
      state = update(state, action);
      add(state);
    });
  });
};
