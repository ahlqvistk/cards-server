const {create} = require('@most/create');

const update = require('./update');

module.exports = function createTable$(table, action$) {
  return create((add, end, error) => {
    action$.observe((action) => {
      table = update(table, action);
      add(table);
    });
  });
};
