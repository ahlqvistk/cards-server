const orderArrayFromIndex = require('./order-array-from-index');

const arr1 = ['a', 'b', 'c', 'd'];
const arr2 = ['a', 'b', 'c', 'd', 'e', 'f'];

test('should place items in correct order', () => {
  expect(orderArrayFromIndex(0, arr1)).toEqual(arr1);
  expect(orderArrayFromIndex(1, arr1)).toEqual(['b', 'c', 'd', 'a']);
  expect(orderArrayFromIndex(2, arr1)).toEqual(['c', 'd', 'a', 'b']);
  expect(orderArrayFromIndex(3, arr1)).toEqual(['d', 'a', 'b', 'c']);
  expect(orderArrayFromIndex(3, arr2)).toEqual(['d', 'e', 'f', 'a', 'b', 'c']);
});
