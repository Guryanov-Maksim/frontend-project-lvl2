import _ from 'lodash';
import types from '../types.js';

const signsMap = {
  [types.added]: '+',
  [types.removed]: '-',
  [types.nested]: ' ',
  [types.unchanged]: ' ',
};

const space = ' ';
const spacesCount = 4;
const propertySpacesCount = 2;
const prefix = space.repeat(spacesCount);
const propertyPrefix = space.repeat(propertySpacesCount);

const wrapInCurlyBrackets = (value, finiteUndent = '') => `{\n${value.join('\n')}\n${finiteUndent}}`;

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

const stylizeKey = (indent, key, sign = null) => (
  sign === null
    ? `${indent}${key}`
    : `${indent}${sign} ${key}`
);

const stylizeValue = (value, depth) => {
  const { сurrentIndent, prevIndent } = getIndents(depth);
  if (!_.isPlainObject(value)) {
    return value;
  }
  const keys = Object.keys(value);
  const strylizedProperties = keys.map((key) => {
    const stylizedValue = stylizeValue(value[key], depth + 1);
    const stylizedKey = stylizeKey(сurrentIndent, key);
    return `${stylizedKey}: ${stylizedValue}`;
  });
  return wrapInCurlyBrackets(strylizedProperties, prevIndent);
};

const stylizeNode = (node, depth) => {
  const {
    key,
    type,
    values,
    children,
  } = node;
  const { propertyIndent, сurrentIndent } = getIndents(depth);

  switch (type) {
    case types.added: {
      const addedKey = stylizeKey(propertyIndent, key, signsMap[types.added]);
      const valueAfter = stylizeValue(values.valueAfter, depth + 1);
      return `${addedKey}: ${valueAfter}`;
    }
    case types.removed: {
      const removedKey = stylizeKey(propertyIndent, key, signsMap[types.removed]);
      const valueBefore = stylizeValue(values.valueBefore, depth + 1);
      return `${removedKey}: ${valueBefore}`;
    }
    case types.updated: {
      const addedKey = stylizeKey(propertyIndent, key, signsMap[types.added]);
      const removedKey = stylizeKey(propertyIndent, key, signsMap[types.removed]);
      const valueBefore = stylizeValue(values.valueBefore, depth + 1);
      const valueAfter = stylizeValue(values.valueAfter, depth + 1);
      return [
        `${removedKey}: ${valueBefore}`,
        `${addedKey}: ${valueAfter}`,
      ].join('\n');
    }
    case types.nested: {
      const nestedKey = stylizeKey(propertyIndent, key, signsMap[types.nested]);
      const result = children.map((child) => stylizeNode(child, depth + 1));
      const wrappedResult = wrapInCurlyBrackets(result, сurrentIndent);
      return `${nestedKey}: ${wrappedResult}`;
    }
    case types.unchanged: {
      const unchangedKey = stylizeKey(propertyIndent, key, signsMap[types.unchanged]);
      const valueBefore = stylizeValue(values.valueBefore, depth + 1);
      return `${unchangedKey}: ${valueBefore}`;
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
