const getDealOrder = require('./get-deal-order');

test('should return the right order for different ids', () => {
  const players = [
    {
      socket: {id: 'a'},
    },
    {
      socket: {id: 'b'},
    },
    {
      socket: {id: 'c'},
    },
    {
      socket: {id: 'd'},
    },
  ];

  expect(getDealOrder('a', 'b', players)).toEqual(0);
  expect(getDealOrder('a', 'c', players)).toEqual(1);
  expect(getDealOrder('c', 'a', players)).toEqual(1);
  expect(getDealOrder('c', 'c', players)).toEqual(3);
  expect(getDealOrder('d', 'c', players)).toEqual(2);
});

test('should return the right order for different ids', () => {
  const players = [
    {
      socket: {id: 'a'},
    },
    {
      socket: {id: 'b'},
    },
    {
      socket: {id: 'c'},
    },
    {
      socket: {id: 'd'},
    },
    {
      socket: {id: 'e'},
    },
    {
      socket: {id: 'f'},
    },
  ];

  expect(getDealOrder('a', 'b', players)).toEqual(0);
  expect(getDealOrder('a', 'c', players)).toEqual(1);
  expect(getDealOrder('d', 'b', players)).toEqual(3);
  expect(getDealOrder('e', 'a', players)).toEqual(1);
  expect(getDealOrder('f', 'f', players)).toEqual(5);
});
