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

const stylizeProperty = (key, value) => `${key}: ${value}`;

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
      const addedProperty = stylizeProperty(addedKey, valueAfter);
      return addedProperty;
    }
    case types.removed: {
      const removedKey = stylizeKey(propertyIndent, key, signsMap[types.removed]);
      const valueBefore = stylizeValue(values.valueBefore, depth + 1);
      const removedProperty = stylizeProperty(removedKey, valueBefore);
      return removedProperty;
    }
    case types.updated: {
      const addedKey = stylizeKey(propertyIndent, key, signsMap[types.added]);
      const valueAfter = stylizeValue(values.valueAfter, depth + 1);
      const addedProperty = stylizeProperty(addedKey, valueAfter);

      const removedKey = stylizeKey(propertyIndent, key, signsMap[types.removed]);
      const valueBefore = stylizeValue(values.valueBefore, depth + 1);
      const removedProperty = stylizeProperty(removedKey, valueBefore);

      return [removedProperty, addedProperty].join('\n');
    }
    case types.nested: {
      const nestedKey = stylizeKey(propertyIndent, key, signsMap[types.nested]);
      const result = children.map((child) => stylizeNode(child, depth + 1));
      const wrappedResult = wrapInCurlyBrackets(result, сurrentIndent);
      const nestedProperty = stylizeProperty(nestedKey, wrappedResult);
      return nestedProperty;
    }
    case types.unchanged: {
      const unchangedKey = stylizeKey(propertyIndent, key, signsMap[types.unchanged]);
      const valueBefore = stylizeValue(values.valueBefore, depth + 1);
      const unchangedProperty = stylizeProperty(unchangedKey, valueBefore);
      return unchangedProperty;
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
