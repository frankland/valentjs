import without from 'lodash/without';
import isString from 'lodash/isString';

function getTestDataFor(types = '') {
  var typesArr = [];
  if (isString(types)) {
    typesArr = [types];
  } else {
    typesArr = types;
  }

  var data = {
    array: ['a', 'b', 'c'],
    obj: { a: 'b' },
    int: 1,
    bool: true,
    fn: () => {},
    str: 'some',
    zero: 0,
    nl: null,
    undef: undefined,
  };

  var testDataTypes = Object.values(data);
  for (let type of typesArr) {
    if (Object.keys(data).indexOf(type) > -1) {
      testDataTypes = without(testDataTypes, data[type]);
    }
  }
  return testDataTypes;
}

module.exports = {
  getTestDataFor: getTestDataFor,
};
