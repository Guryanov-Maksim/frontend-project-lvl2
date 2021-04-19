import _ from 'lodash';
import types from './types.js';

const makeDiffTree = (obj1, obj2) => {
  const keys = Object.keys({ ...obj1, ...obj2 });
  const sortedKeys = _.sortBy(keys);
  const result = sortedKeys.map((key) => {
    const valueBefore = _.get(obj1, key);
    const valueAfter = _.get(obj2, key);
    if (!_.has(obj1, key)) {
      return { key, type: types.added, value: valueAfter };
    }
    if (!_.has(obj2, key)) {
      return { key, type: types.removed, value: valueBefore };
    }
    if (_.isPlainObject(valueAfter) && _.isPlainObject(valueBefore)) {
      return { key, type: types.nested, children: makeDiffTree(obj1[key], obj2[key]) };
    }
    if (valueBefore !== valueAfter) {
      return {
        key,
        type: types.updated,
        valueBefore,
        valueAfter,
      };
    }
    return { key, type: types.unchanged, value: valueBefore };
  });
  return result;
};

export default makeDiffTree;
