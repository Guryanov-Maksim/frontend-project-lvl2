import _ from 'lodash';
import types from '../src/types.js';

const {
  added,
  removed,
  nested,
  updated,
  unchanged,
} = types;

const stringify = (value) => {
  if (_.isPlainObject(value)) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return `${value}`;
};

const convertDiffToPlain = (node, pathToKey) => {
  const {
    key,
    type,
    values = {},
    children,
  } = node;
  const fullPath = pathToKey.concat(`${key}`);
  const valueBefore = stringify(values.valueBefore);
  const valueAfter = stringify(values.valueAfter);
  switch (type) {
    case added:
      return `Property '${fullPath}' was added with value: ${valueAfter}`;
    case removed:
      return `Property '${fullPath}' was removed`;
    case updated:
      return `Property '${fullPath}' was updated. From ${valueBefore} to ${valueAfter}`;
    case nested: {
      return children
        .map((child) => convertDiffToPlain(child, `${fullPath}.`))
        .filter((plainChild) => plainChild !== '')
        .join('\n');
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
