import isObject from '../src/isObject.js';
import types from '../src/typesEnum.js';

const {
  added,
  removed,
  updated,
  nested,
  unchanged,
} = types;

const signsMap = {
  add: '+',
  remove: '-',
  update: ' ',
  nest: ' ',
};

const wrapInCurlyBrackets = (value, finiteUndent = '') => `{\n${value}\n${finiteUndent}}`;

const getUndents = (depth) => {
  const space = ' ';
  const spaceCount = 4;
  const propertySpaceCount = 2;
  const unitary = space.repeat(spaceCount);
  const truncated = space.repeat(propertySpaceCount);
  const onCurrentDepth = unitary.repeat(depth);
  const onPrevDepth = space.repeat(spaceCount * (depth - 1));
  const forProperty = onPrevDepth.concat(truncated);
  return {
    forProperty,
    onPrevDepth,
    onCurrentDepth,
  };
};

const stylizeValue = (value, depth) => {
  const { onCurrentDepth, onPrevDepth } = getUndents(depth);
  if (!isObject(value)) {
    return value;
  }
  const keys = Object.keys(value);
  const strylizedEntries = keys
    .map((key) => {
      const stylizedValue = stylizeValue(value[key], depth + 1);
      return `${onCurrentDepth}${key}: ${stylizedValue}`;
    })
    .join('\n');
  return wrapInCurlyBrackets(strylizedEntries, onPrevDepth);
};

const stylizeNode = (node, depth) => {
  const {
    key,
    type,
    values = {},
    children,
  } = node;
  const { forProperty, onCurrentDepth } = getUndents(depth);
  const valueBefore = stylizeValue(values.valueBefore, depth + 1);
  const valueAfter = stylizeValue(values.valueAfter, depth + 1);
  const addedKey = `${signsMap.add} ${key}`;
  const removedKey = `${signsMap.remove} ${key}`;
  const unchangedKey = `${signsMap.update} ${key}`;
  const nestedKey = `${signsMap.nest} ${key}`;

  switch (type) {
    case added:
      return `${forProperty}${addedKey}: ${valueAfter}`;
    case removed:
      return `${forProperty}${removedKey}: ${valueBefore}`;
    case updated:
      return `${forProperty}${removedKey}: ${valueBefore}\n${forProperty}${addedKey}: ${valueAfter}`;
    case nested: {
      const result = children
        .map((child) => stylizeNode(child, depth + 1))
        .join('\n');
      const wrappedResult = wrapInCurlyBrackets(result, onCurrentDepth);
      return `${forProperty}${nestedKey}: ${wrappedResult}`;
    }
    case unchanged:
      return `${forProperty}${unchangedKey}: ${valueBefore}`;
    default:
      throw new Error(`non supported node type: ${type}`);
  }
};

export default (diffTree) => {
  const result = diffTree
    .map((node) => stylizeNode(node, 1))
    .join('\n');
  const wrappedResult = wrapInCurlyBrackets(result);
  return wrappedResult;
};
