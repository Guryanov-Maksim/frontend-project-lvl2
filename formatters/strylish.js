import _ from 'lodash';
import isObject from '../lib/isObject.js';

const stylizeValue = (value, undent, depth) => {
  if (isObject(value)) {
    const keys = Object.keys(value);
    const entryUndent = undent.repeat(depth);
    const endUndent = undent.repeat(depth - 1);
    const strylizedEntries = keys.map((key) => {
      const stylizedValue = stylizeValue(value[key], undent, depth + 1);
      return `${entryUndent}${key}: ${stylizedValue}`;
    });
    return `{\n${strylizedEntries.join('\n')}\n${endUndent}}`;
  }
  return value;
};

const getStyliziedValue = (value, undent, depth) => {
  const { valueBefore, valueAfter } = value;
  const styliziedValueBefore = stylizeValue(valueBefore, undent, depth);
  const styliziedValueAfter = stylizeValue(valueAfter, undent, depth);
  return { styliziedValueBefore, styliziedValueAfter };
};

const makeDiffItem = (item, undent, depth) => {
  const addSign = '+';
  const removeSign = '-';
  const unchangeSign = ' ';

  const { key, type, value } = item;
  const styliziedValue = getStyliziedValue(value, undent, depth + 1);
  const { styliziedValueBefore, styliziedValueAfter } = styliziedValue;
  if (type === 'added') {
    const addedKey = `${addSign} ${key}`;
    return [`${addedKey}: ${styliziedValueAfter}`];
  }
  if (type === 'removed') {
    const removedKey = `${removeSign} ${key}`;
    return [`${removedKey}: ${styliziedValueBefore}`];
  }
  if (type === 'updated') {
    const addedKey = `${addSign} ${key}`;
    const removedKey = `${removeSign} ${key}`;
    return [`${removedKey}: ${styliziedValueBefore}`, `${addedKey}: ${styliziedValueAfter}`];
  }
  const unchangedKey = `${unchangeSign} ${key}`;
  return [`${unchangedKey}: ${styliziedValueBefore}`];
};

export default (tree) => {
  const defaultUndent = '    ';

  const inner = (node, depth) => {
    const propertyUndent = defaultUndent.repeat(depth);
    const cutPropertyUndend = propertyUndent.slice(0, propertyUndent.length - 2);
    if (!_.has(node, 'children')) {
      const entry = makeDiffItem(node, defaultUndent, depth);
      return `${cutPropertyUndend}${entry.join(`\n${cutPropertyUndend}`)}`;
    }
    const { key, children } = node;
    const result = children.map((child) => {
      const item = inner(child, depth + 1);
      return item;
    });
    return `${propertyUndent}${key}: {\n${result.join('\n')}\n${propertyUndent}}`;
  };
  const result = tree.map((node) => inner(node, 1));
  return `{\n${result.join('\n')}\n}`;
};
