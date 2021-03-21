import _ from 'lodash';

const hasChildren = (tree) => Array.isArray(tree);

const makeDiffItem = (item) => {
  const addSign = '+';
  const removeSign = '-';
  const unchangeSign = '  ';
  const { key, type, value } = item;
  if (type === 'added') {
    return `${addSign} ${key}: ${value}`;
  }
  if (type === 'removed') {
    return `${removeSign} ${key}: ${value}`;
  }
  if (type === 'updated') {
    const { valueBefore, valueAfter } = value;
    return `${addSign} ${key}: ${valueBefore}\n${removeSign} ${key}: ${valueAfter}`;
  }
  return `${unchangeSign} ${key}: ${value}`;
};

export default (object) => {
  const space = ' ';
  const spaceCount = 4;
  const inner = (tree, depth) => {
    const entryUndent = space.repeat(depth * spaceCount);
    const endUndent = space.repeat((depth - 1) * spaceCount);
    if (!hasChildren(tree)) {
      return `${entryUndent}${makeDiffItem(tree)}`;
    }
    const { children } = tree;
    const result = children.map((child) => {
      // const undent = key.startsWith('+') || key.startsWith('-')
      //   ? entryUndent.slice(0, entryUndent.length - 2)
      //   : entryUndent;
      // if (_.isObjectLike(value)) {
      const item = inner(child, depth + 1);
      return `${entryUndent}${makeDiffItem(item)}`;
      // }
      // return `${undent}${key}: ${value}`;
    });
    return `{\n${result.join('\n')}\n${endUndent}}`;
  };
  return inner(object, 1);
};
