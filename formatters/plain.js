import _ from 'lodash';
import isObject from '../lib/isObject.js';

const normalizeValue = (value) => {
  if (isObject(value)) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

const getNormalizedValue = (value) => {
  const { valueBefore, valueAfter } = value;
  const normalizedValueBefore = normalizeValue(valueBefore);
  const normalizedValueAfter = normalizeValue(valueAfter);
  return { normalizedValueBefore, normalizedValueAfter };
};

export default (object) => {
  const inner = (node, pathToKey) => {
    const { key, type } = node;
    const fullPath = pathToKey.concat(`${key}`);
    if (!_.has(node, 'children')) {
      const { value } = node;
      const normalizedValue = getNormalizedValue(value);
      if (type === 'added') {
        const { normalizedValueAfter } = normalizedValue;
        return `Property '${fullPath}' was added with value: ${normalizedValueAfter}`;
      }
      if (type === 'removed') {
        return `Property '${fullPath}' was removed`;
      }
      if (type === 'updated') {
        const { normalizedValueBefore, normalizedValueAfter } = normalizedValue;
        return `Property '${fullPath}' was updated. From ${normalizedValueBefore} to ${normalizedValueAfter}`;
      }
      return '';
    }
    const { children } = node;
    const result = children.map((child) => inner(child, `${fullPath}.`));
    return result.filter((item) => item !== '').join('\n');
  };
  return object.map((item) => inner(item, '')).join('\n');
};
