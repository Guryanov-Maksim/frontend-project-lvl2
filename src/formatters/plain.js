import _ from 'lodash';
import types from '../types.js';

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
    values,
    children,
  } = node;
  const fullPath = pathToKey.concat(`${key}`);
  switch (type) {
    case types.added: {
      const valueAfter = stringify(values.valueAfter);
      return `Property '${fullPath}' was added with value: ${valueAfter}`;
    }
    case types.removed:
      return `Property '${fullPath}' was removed`;
    case types.updated: {
      const valueBefore = stringify(values.valueBefore);
      const valueAfter = stringify(values.valueAfter);
      return `Property '${fullPath}' was updated. From ${valueBefore} to ${valueAfter}`;
    }
    case types.nested: {
      return children.flatMap((child) => convertDiffToPlain(child, `${fullPath}.`));
    }
    case types.unchanged:
      return '';
    default:
      throw new Error(`non supported node type: ${type}`);
  }
};

export default (diffTree) => diffTree
  .flatMap((node) => convertDiffToPlain(node, ''))
  .filter((plainDiff) => plainDiff !== '')
  .join('\n');
