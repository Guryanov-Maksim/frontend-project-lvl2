import types from '../src/types.js';

const {
  added,
  removed,
  updated,
  nested,
  unchanged,
} = types;

const addSign = '+';
const removeSign = '-';

const convertDiffToObject = (node) => {
  const {
    key,
    type,
    values = {},
    children,
  } = node;
  const addedKey = `${addSign} ${key}`;
  const removedKey = `${removeSign} ${key}`;
  const unchangedKey = `${key}`;
  const { valueBefore, valueAfter } = values;

  switch (type) {
    case added:
      return { [addedKey]: valueAfter };
    case removed:
      return { [removedKey]: valueBefore };
    case updated:
      return {
        [removedKey]: valueBefore,
        [addedKey]: valueAfter,
      };
    case nested: {
      const result = children.reduce((acc, child) => (
        { ...acc, ...convertDiffToObject(child) }
      ), {});
      return { [unchangedKey]: result };
    }
    case unchanged:
      return { [unchangedKey]: valueBefore };
    default:
      throw new Error(`non supported node type: ${type}`);
  }
};

export default (diffTree) => {
  const json = JSON.stringify(diffTree.reduce((acc, node) => (
    { ...acc, ...convertDiffToObject(node) }
  ), {}));
  return json;
};
