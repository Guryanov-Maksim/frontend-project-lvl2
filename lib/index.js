import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import parse from './parsers.js';
import format from '../formatters/index.js';

const isObject = (item) => {
  if (_.isObjectLike(item) && !Array.isArray(item)) {
    return true;
  }
  return false;
};

export default (filePath1, filePath2, formatName) => {
  const readFile = (pathToFile) => {
    const fullPath = path.resolve(process.cwd(), pathToFile);
    const data = fs.readFileSync(fullPath, 'utf-8');
    return data;
  };

  const calcDifference = (obj1, obj2) => {
    const inner = (obj, pathToValue) => {
      const keys = Object.keys(obj);
      const sortedKeys = _.sortBy(keys);
      const result = sortedKeys.map((key) => {
        const fullPath = `${pathToValue}${key}`;
        const valueBefore = _.get(obj1, fullPath);
        const valueAfter = _.get(obj2, fullPath);
        if (!_.has(obj1, fullPath)) {
          return { key, type: 'added', value: valueAfter };
        }
        if (!_.has(obj2, fullPath)) {
          return { key, type: 'removed', value: valueBefore };
        }
        if (isObject(valueAfter) && isObject(valueBefore)) {
          return { key, type: 'unchanged', children: inner(obj[key], `${fullPath}.`) };
        }
        if (valueBefore !== valueAfter) {
          return {
            key,
            type: 'updated',
            value: {
              valueBefore,
              valueAfter,
            },
          };
        }
        return { key, type: 'unchanged', value: valueBefore };
      });
      return result;
    };

    const obj1Clone = _.cloneDeep(obj1);
    const joinedObj = _.merge(obj1Clone, obj2);
    return inner(joinedObj, '');
  };

  const file1Extention = path.extname(filePath1);
  const file2Extention = path.extname(filePath2);
  const data1 = readFile(filePath1);
  const data2 = readFile(filePath2);
  const obj1 = parse(file1Extention, data1);
  const obj2 = parse(file2Extention, data2);
  const difference = calcDifference(obj1, obj2);
  // console.log(JSON.stringify(difference, null, '  '));
  const formatedDiff = format(difference, formatName);
  console.log(formatedDiff);
  return formatedDiff;
};
