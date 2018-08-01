const {create} = require('@most/create');

module.exports = function createState$(state, action$, update) {
  return create((add, end, error) => {
    action$.observe((action) => {
      state = update(state, action);
      add(state);
    });
  });
};
