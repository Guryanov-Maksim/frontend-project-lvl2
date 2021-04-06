import types from '../src/types.js';

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
    case types.added:
      return { [addedKey]: valueAfter };
    case types.removed:
      return { [removedKey]: valueBefore };
    case types.updated:
      return {
        [removedKey]: valueBefore,
        [addedKey]: valueAfter,
      };
    case types.nested: {
      const result = children.reduce((acc, child) => (
        { ...acc, ...convertDiffToObject(child) }
      ), {});
      return { [unchangedKey]: result };
    }
    case types.unchanged:
      return { [unchangedKey]: valueBefore };
    default:
      throw new Error(`non supported node type: ${type}`);
  }
};

export default (diffTree) => diffTree.reduce((acc, node) => (
  { ...acc, ...convertDiffToObject(node) }
), {});
