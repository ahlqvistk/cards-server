module.exports = function removeKeys(keys, obj) {
  const newObj = Object.assign({}, obj);

  keys.forEach((key) => {
    delete newObj[key];
  });

  return newObj;
};
