import _ from 'lodash';
import types from '../types.js';

const space = ' ';
const spacesCount = 4;
const prefix = space.repeat(spacesCount);

const signsMap = {
  [types.added]: '+',
  [types.removed]: '-',
  [types.nested]: ' ',
  [types.unchanged]: ' ',
  [types.updated]: ' ',
};

const valuesMap = {
  [types.added]: 'valueAfter',
  [types.removed]: 'valueBefore',
  [types.unchanged]: 'valueBefore',
};

const makePrefix = (depth) => `${prefix.repeat(depth)}`;

const wrapInCurlyBrackets = (value, finiteUndent = '') => `{\n${value.join('\n')}\n${finiteUndent}}`;

const stylizeValue = (value, depth) => {
  if (!_.isPlainObject(value)) {
    return value;
  }
  const keys = Object.keys(value);
  const strylizedProperties = keys.map((key) => {
    const stylizedValue = stylizeValue(value[key], depth + 1);
    return `${makePrefix(depth)}${key}: ${stylizedValue}`;
  });
  return wrapInCurlyBrackets(strylizedProperties, makePrefix(depth - 1));
};

const prepareKey = (indent, key) => (sign) => `${indent}${space} ${sign} ${key}`;

const stylizeProperty = (key, value) => `${key}: ${value}`;

const stylizeNode = (node, depth) => {
  const {
    key,
    type,
    values,
    children,
  } = node;

  const addSignToKey = prepareKey(makePrefix(depth - 1), key);

  switch (type) {
    case types.added:
    case types.removed:
    case types.unchanged: {
      return stylizeProperty(
        addSignToKey(signsMap[type]),
        stylizeValue(values[valuesMap[type]], depth + 1),
      );
    }
    case types.updated: {
      const addedProperty = stylizeProperty(
        addSignToKey(signsMap[types.added]),
        stylizeValue(values.valueAfter, depth + 1),
      );
      const removedProperty = stylizeProperty(
        addSignToKey(signsMap[types.removed]),
        stylizeValue(values.valueBefore, depth + 1),
      );

      return [removedProperty, addedProperty].join('\n');
    }
    case types.nested: {
      const result = children.map((child) => stylizeNode(child, depth + 1));
      const wrappedResult = wrapInCurlyBrackets(result, makePrefix(depth));
      return stylizeProperty(
        addSignToKey(signsMap[type]),
        wrappedResult,
      );
    }
    default:
      throw new Error(`non supported node type: ${type}`);
  }
};

export default (diffTree) => {
  const result = diffTree.map((node) => stylizeNode(node, 1));
  const wrappedResult = wrapInCurlyBrackets(result);
  return wrappedResult;
};
