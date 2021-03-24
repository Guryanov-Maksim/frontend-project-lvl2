import _ from 'lodash';

export default (tree) => {
  const addSign = '+';
  const removeSign = '-';

  const inner = (node) => {
    const { key, type } = node;
    const unchangedKey = `${key}`;
    if (!_.has(node, 'children')) {
      const { value } = node;
      const { valueBefore, valueAfter } = value;
      const addedKey = `${addSign} ${key}`;
      const removedKey = `${removeSign} ${key}`;

      if (type === 'added') {
        return { [addedKey]: valueAfter };
      }
      if (type === 'removed') {
        return { [removedKey]: valueBefore };
      }
      if (type === 'updated') {
        return {
          [removedKey]: valueBefore,
          [addedKey]: valueAfter,
        };
      }
      return { [unchangedKey]: valueBefore };
    }

    const { children } = node;
    const result = children.reduce((acc, child) => {
      const value = inner(child);
      return { ...acc, ...value };
    }, {});
    return { [unchangedKey]: result };
  };
  return tree.reduce((acc, node) => ({ ...acc, ...inner(node) }), {});
};
