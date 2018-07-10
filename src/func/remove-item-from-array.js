const deepEqual = require('deep-equal');

module.exports = function removeItemFromArray(item, arr) {
  return arr.filter((x) => !deepEqual(x, item));
};
