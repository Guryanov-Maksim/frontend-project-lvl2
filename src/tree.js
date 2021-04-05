import _ from 'lodash';
import isObject from './isObject.js';
import types from './types.js';

const {
  added,
  removed,
  nested,
  unchanged,
  updated,
} = types;

const makeDiffTree = (obj1, obj2) => {
  const keys = Object.keys({ ...obj1, ...obj2 });
  const sortedKeys = _.sortBy(keys);
  const result = sortedKeys.map((key) => {
    const valueBefore = _.get(obj1, key);
    const valueAfter = _.get(obj2, key);
    if (!_.has(obj1, key)) {
      return { key, type: added, values: { valueAfter } };
    }
    if (!_.has(obj2, key)) {
      return { key, type: removed, values: { valueBefore } };
    }
    if (isObject(valueAfter) && isObject(valueBefore)) {
      return { key, type: nested, children: makeDiffTree(obj1[key], obj2[key]) };
    }
    if (valueBefore !== valueAfter) {
      return {
        key,
        type: updated,
        values: {
          valueBefore,
          valueAfter,
        },
      };
    }
    return { key, type: unchanged, values: { valueBefore } };
  });
  return result;
};

export default makeDiffTree;
