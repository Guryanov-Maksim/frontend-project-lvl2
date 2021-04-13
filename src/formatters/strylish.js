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

const stylizeKey = (sign, key) => `${sign} ${key}`;

const addIndentToKey = (indent, key) => `${indent}${key}`;

const stylizeValue = (value, depth) => {
  const { сurrentIndent, prevIndent } = getIndents(depth);
  if (!_.isPlainObject(value)) {
    return value;
  }
  const keys = Object.keys(value);
  const strylizedProperties = keys
    .map((key) => {
      const stylizedValue = stylizeValue(value[key], depth + 1);
      const keyWithIndent = addIndentToKey(сurrentIndent, key);
      return `${keyWithIndent}: ${stylizedValue}`;
    })
    .join('\n');
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
      const addedKey = stylizeKey(signsMap[types.added], key);
      const addedKeyWithIndent = addIndentToKey(propertyIndent, addedKey);
      const valueAfter = stylizeValue(values.valueAfter, depth + 1);
      return `${addedKeyWithIndent}: ${valueAfter}`;
    }
    case types.removed: {
      const removedKey = stylizeKey(signsMap[types.removed], key);
      const removedKeyWithIndent = addIndentToKey(propertyIndent, removedKey);
      const valueBefore = stylizeValue(values.valueBefore, depth + 1);
      return `${removedKeyWithIndent}: ${valueBefore}`;
    }
    case types.updated: {
      const addedKey = stylizeKey(signsMap[types.added], key);
      const addedKeyWithIndent = addIndentToKey(propertyIndent, addedKey);
      const removedKey = stylizeKey(signsMap[types.removed], key);
      const removedKeyWithIndent = addIndentToKey(propertyIndent, removedKey);
      const valueBefore = stylizeValue(values.valueBefore, depth + 1);
      const valueAfter = stylizeValue(values.valueAfter, depth + 1);
      return [
        `${removedKeyWithIndent}: ${valueBefore}`,
        `${addedKeyWithIndent}: ${valueAfter}`,
      ].join('\n');
    }
    case types.nested: {
      const nestedKey = stylizeKey(signsMap[types.nested], key);
      const nestedKeyWithIndent = addIndentToKey(propertyIndent, nestedKey);
      const result = children
        .map((child) => stylizeNode(child, depth + 1))
        .join('\n');
      const wrappedResult = wrapInCurlyBrackets(result, сurrentIndent);
      return `${nestedKeyWithIndent}: ${wrappedResult}`;
    }
    case types.unchanged: {
      const unchangedKey = stylizeKey(signsMap[types.unchanged], key);
      const unchangedKeyWithIndent = addIndentToKey(propertyIndent, unchangedKey);
      const valueBefore = stylizeValue(values.valueBefore, depth + 1);
      return `${unchangedKeyWithIndent}: ${valueBefore}`;
    }
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
