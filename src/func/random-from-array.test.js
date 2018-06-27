const randomFromArray = require('./random-from-array');

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

test('should return an item from the array', () => {
  expect(arr).toContain(randomFromArray(arr));
});

test('should return different values', () => {
  const value1 = randomFromArray(arr)/randomFromArray(arr)/randomFromArray(arr);
  const value2 = randomFromArray(arr)/randomFromArray(arr)/randomFromArray(arr);

  expect(value1).not.toEqual(value2);
});
