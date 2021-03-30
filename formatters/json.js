import _ from 'lodash';
import types from '../src/typesEnum.js';

const { added, removed, updated } = types;

const addSign = '+';
const removeSign = '-';

const convertDiffToObject = (node) => {
  const { key, type } = node;
  const unchangedKey = `${key}`;
  if (!_.has(node, 'children')) {
    const { values } = node;
    const { valueBefore, valueAfter } = values;
    const addedKey = `${addSign} ${key}`;
    const removedKey = `${removeSign} ${key}`;

    if (type === added) {
      return { [addedKey]: valueAfter };
    }
    if (type === removed) {
      return { [removedKey]: valueBefore };
    }
    if (type === updated) {
      return {
        [removedKey]: valueBefore,
        [addedKey]: valueAfter,
      };
    }
    return { [unchangedKey]: valueBefore };
  }

  const { children } = node;
  const result = children.reduce((acc, child) => {
    const value = convertDiffToObject(child);
    return { ...acc, ...value };
  }, {});
  return { [unchangedKey]: result };
};

export default (diffTree) => {
  const json = JSON.stringify(diffTree.reduce((acc, node) => (
    { ...acc, ...convertDiffToObject(node) }
  ), {}));
  return json;
};
