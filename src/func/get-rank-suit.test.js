const {getRank, getSuit, getUnicodeSuit} = require('./get-rank-suit');

test('should return the right rank', () => {
  expect(getRank('c7')).toEqual('7');
  expect(getRank('sA')).toEqual('A');
  expect(getRank('h4')).toEqual('4');
  expect(getRank('d10')).toEqual('10');
});

test('should return the right suit', () => {
  expect(getSuit('c7')).toEqual('clubs');
  expect(getSuit('sA')).toEqual('spades');
  expect(getSuit('h4')).toEqual('hearts');
  expect(getSuit('d10')).toEqual('diamonds');
});

test('should return the right unicode suit', () => {
  expect(getUnicodeSuit('c7')).toEqual('\u2663');
  expect(getUnicodeSuit('sA')).toEqual('\u2660');
  expect(getUnicodeSuit('h4')).toEqual('\u2665');
  expect(getUnicodeSuit('d10')).toEqual('\u2666');
});
