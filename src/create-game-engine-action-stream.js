const deepEqual = require('deep-equal');
const {create} = require('@most/create');

const gameEngine = require('./game-engine');

module.exports = function createGameEngineAction$(state$) {
  return create((add, end, error) => {
    state$.skipRepeatsWith(deepEqual).observe((state) => {
      gameEngine(state, add);
    });
  });
};
