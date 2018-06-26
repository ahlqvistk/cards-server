const removeKeys = require('./remove-keys');

const keys = ['a', 'c', 'e'];
const obj = {
  'a': 1,
  'b': 1,
  'c': 1,
  'd': 1,
  'e': 1,
};
const expected = {
  'b': 1,
  'd': 1,
};

test('should remove passed keys from object', () => {
  expect(removeKeys(keys, obj)).toEqual(expected);
});
