import _ from 'lodash';
import types from '../src/types.js';

const signsMap = {
  add: '+',
  remove: '-',
  update: ' ',
  nest: ' ',
};

const space = ' ';
const spacesCount = 4;
const propertySpacesCount = 2;
const prefix = space.repeat(spacesCount);
const propertyPrefix = space.repeat(propertySpacesCount);

const wrapInCurlyBrackets = (value, finiteUndent = '') => `{\n${value}\n${finiteUndent}}`;

const getIndents = (depth) => {
  const сurrentIndent = prefix.repeat(depth);
  const prevIndent = prefix.repeat(depth - 1);
  const propertyIndent = prevIndent.concat(propertyPrefix);
  return {
    propertyIndent,
    prevIndent,
    сurrentIndent,
  };
};

const stylizeValue = (value, depth) => {
  const { сurrentIndent, prevIndent } = getIndents(depth);
  if (!_.isPlainObject(value)) {
    return value;
  }
  const keys = Object.keys(value);
  const strylizedProperties = keys
    .map((key) => {
      const stylizedValue = stylizeValue(value[key], depth + 1);
      return `${сurrentIndent}${key}: ${stylizedValue}`;
    })
    .join('\n');
  return wrapInCurlyBrackets(strylizedProperties, prevIndent);
};

const stylizeNode = (node, depth) => {
  const {
    key,
    type,
    values = {},
    children,
  } = node;
  const { propertyIndent, сurrentIndent } = getIndents(depth);
  const valueBefore = stylizeValue(values.valueBefore, depth + 1);
  const valueAfter = stylizeValue(values.valueAfter, depth + 1);
  const addedKey = `${signsMap.add} ${key}`;
  const removedKey = `${signsMap.remove} ${key}`;
  const unchangedKey = `${signsMap.update} ${key}`;
  const nestedKey = `${signsMap.nest} ${key}`;

  switch (type) {
    case types.added:
      return `${propertyIndent}${addedKey}: ${valueAfter}`;
    case types.removed:
      return `${propertyIndent}${removedKey}: ${valueBefore}`;
    case types.updated:
      return `${propertyIndent}${removedKey}: ${valueBefore}\n${propertyIndent}${addedKey}: ${valueAfter}`;
    case types.nested: {
      const result = children
        .map((child) => stylizeNode(child, depth + 1))
        .join('\n');
      const wrappedResult = wrapInCurlyBrackets(result, сurrentIndent);
      return `${propertyIndent}${nestedKey}: ${wrappedResult}`;
    }
    case types.unchanged:
      return `${propertyIndent}${unchangedKey}: ${valueBefore}`;
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
