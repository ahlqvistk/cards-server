const shuffleArray = require('./shuffle-array');

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

test('should return array with same content', () => {
  expect(shuffleArray(arr)).toEqual(expect.arrayContaining(arr));
});

test('should return a shuffled array', () => {
  const arrA = shuffleArray(arr);
  const arrB = shuffleArray(arr);
  const arrC = shuffleArray(arr);
  const arrD = shuffleArray(arr);

  const arr1 = arrA.concat(arrB);
  const arr2 = arrC.concat(arrD);

  expect(arr1).toEqual(expect.arrayContaining(arr2));
  expect(arr1).not.toEqual(arr2);
});
