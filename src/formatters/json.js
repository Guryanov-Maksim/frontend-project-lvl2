import types from '../types.js';

const addSign = '+';
const removeSign = '-';

const convertTreeToObject = (tree, convertNode) => tree.reduce((acc, node) => (
  { ...acc, ...convertNode(node) }
), {});

const convertNodeToObject = (node) => {
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
      const convertedChildren = convertTreeToObject(children, convertNodeToObject);
      return { [unchangedKey]: convertedChildren };
    }
    case types.unchanged:
      return { [unchangedKey]: valueBefore };
    default:
      throw new Error(`non supported node type: ${type}`);
  }
};

export default (diffTree) => convertTreeToObject(diffTree, convertNodeToObject);
