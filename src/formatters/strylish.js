import _ from 'lodash';
import types from '../types.js';

const signsMap = {
  [types.added]: '+',
  [types.removed]: '-',
  [types.nested]: ' ',
  [types.unchanged]: ' ',
  [types.updated]: ' ',
};

const space = ' ';
const spacesCount = 4;

const makePrefix = (depth) => space.repeat(depth * spacesCount);

const wrapNestedValue = (value, finiteUndent = '') => `{\n${value.join('\n')}\n${finiteUndent}}`;

const stringifyValue = (value, depth) => {
  if (!_.isPlainObject(value)) {
    return value;
  }
  const keys = Object.keys(value);
  const stringifiedProperties = keys.map((key) => {
    const stringifiedValue = stringifyValue(value[key], depth + 1);
    const indent = makePrefix(depth);
    return `${indent}${key}: ${stringifiedValue}`;
  });
  return wrapNestedValue(stringifiedProperties, makePrefix(depth - 1));
};

const stringifyProperty = (key, type, value, depth) => {
  const indent = makePrefix(depth - 1);
  const sign = signsMap[type];
  const stringifiedValue = stringifyValue(value, depth + 1);

  return `${indent}  ${sign} ${key}: ${stringifiedValue}`;
};

const stringifyNode = (node, depth) => {
  const {
    key,
    type,
    children,
  } = node;

  switch (type) {
    case types.added:
    case types.removed:
    case types.unchanged: {
      return stringifyProperty(key, type, node.value, depth);
    }
    case types.updated: {
      const addedProperty = stringifyProperty(key, types.added, node.valueAfter, depth);
      const removedProperty = stringifyProperty(key, types.removed, node.valueBefore, depth);
      return [removedProperty, addedProperty].join('\n');
    }
    case types.nested: {
      const result = children.map((child) => stringifyNode(child, depth + 1));
      const wrappedResult = wrapNestedValue(result, makePrefix(depth));
      return stringifyProperty(key, type, wrappedResult, depth);
    }
    default:
      throw new Error(`non supported node type: ${type}`);
  }
};

export default (diffTree) => {
  const result = diffTree.map((node) => stringifyNode(node, 1));
  return wrapNestedValue(result);
};
