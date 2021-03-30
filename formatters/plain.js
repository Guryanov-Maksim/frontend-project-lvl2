import isObject from '../src/isObject.js';
import types from '../src/typesEnum.js';

const {
  added,
  removed,
  nested,
  updated,
  unchanged,
} = types;

const stringify = (value) => {
  if (isObject(value)) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return `${value}`;
};

const getStringifiedValues = (values = {}) => {
  const valueBefore = stringify(values.valueBefore);
  const valueAfter = stringify(values.valueAfter);
  return { valueBefore, valueAfter };
};

const convertDiffToPlain = (node, pathToKey) => {
  const { key, type } = node;
  const fullPath = pathToKey.concat(`${key}`);
  const { values } = node;
  const { valueBefore, valueAfter } = getStringifiedValues(values);
  switch (type) {
    case added:
      return `Property '${fullPath}' was added with value: ${valueAfter}`;
    case removed:
      return `Property '${fullPath}' was removed`;
    case updated:
      return `Property '${fullPath}' was updated. From ${valueBefore} to ${valueAfter}`;
    case nested: {
      const { children } = node;
      const result = children.map((child) => convertDiffToPlain(child, `${fullPath}.`));
      return result.filter((item) => item !== '').join('\n');
    }
    case unchanged:
      return '';
    default:
      throw new Error(`non supported node type: ${type}`);
  }
};

export default (diffTree) => (
  diffTree.map((node) => convertDiffToPlain(node, '')).join('\n')
);
