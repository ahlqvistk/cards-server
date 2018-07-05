module.exports = function orderArrayFromIndex(index, arr) {
  if (index === 0) {
    return arr;
  }
  return arr.slice(index).concat(arr.slice(0, index));
};
