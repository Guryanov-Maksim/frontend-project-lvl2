import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import parse from './parser.js';
import format from '../formatters/index.js';
import isObject from './isObject.js';

const types = {
  added: 'added',
  nested: 'nested',
  removed: 'removed',
  updated: 'updated',
};

const readFile = (pathToFile) => {
  const fullPath = path.resolve(process.cwd(), pathToFile);
  const data = fs.readFileSync(fullPath, 'utf-8');
  return data;
};

const calcDifference = (obj1, obj2) => {
  const keys = Object.keys({ ...obj1, ...obj2 });
  const sortedKeys = _.sortBy(keys);
  const result = sortedKeys.map((key) => {
    const valueBefore = _.get(obj1, key);
    const valueAfter = _.get(obj2, key);
    if (!_.has(obj1, key)) {
      return { key, type: types.added, values: { valueAfter } };
    }
    if (!_.has(obj2, key)) {
      return { key, type: types.removed, values: { valueBefore } };
    }
    if (isObject(valueAfter) && isObject(valueBefore)) {
      return { key, type: types.nested, children: calcDifference(obj1[key], obj2[key]) };
    }
    if (valueBefore !== valueAfter) {
      return {
        key,
        type: types.updated,
        values: {
          valueBefore,
          valueAfter,
        },
      };
    }
    return { key, type: types.unchanged, values: { valueBefore } };
  });
  return result;
};

export default (filePath1, filePath2, formatName) => {
  const file1Extention = path.extname(filePath1);
  const file2Extention = path.extname(filePath2);
  const data1 = readFile(filePath1);
  const data2 = readFile(filePath2);
  const obj1 = parse(file1Extention, data1);
  const obj2 = parse(file2Extention, data2);
  const difference = calcDifference(obj1, obj2);
  const formatedDiff = format(difference, formatName);
  return formatedDiff;
};

export { types };
