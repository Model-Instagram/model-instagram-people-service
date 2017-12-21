const getCommonElements = (array1, array2) => {
  let compositeObject = {};
  let commonElements = [];

  array1.forEach((element) => {
    compositeObject[element] = 1;
  });

  array2.forEach((element) => {
    if (compositeObject[element]) {
      commonElements.push(element);
    }
  });

  return commonElements;
};

module.exports.getCommonElements = getCommonElements;
