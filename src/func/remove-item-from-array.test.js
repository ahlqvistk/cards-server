const removeItemFromArray = require('./remove-item-from-array');

test('should remove passed item from array', () => {
  expect(removeItemFromArray('c', ['a', 'b', 'c', 'd']))
    .toEqual(['a', 'b', 'd']);
  expect(removeItemFromArray(2, [1, 2, 3, 4]))
    .toEqual([1, 3, 4]);
  expect(removeItemFromArray({a: 1}, [{a: 1}, {b: 2}, {c: 3}]))
    .toEqual([{b: 2}, {c: 3}]);
});
