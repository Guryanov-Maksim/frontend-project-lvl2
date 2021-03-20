import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import parse from './parsers.js';
import format from '../formatters/index.js';
// import plain from '../formatters/plain.js';

export default (filePath1, filePath2, formatName) => {
  const readFile = (pathToFile) => {
    const fullPath = path.resolve(process.cwd(), pathToFile);
    const data = fs.readFileSync(fullPath, 'utf-8');
    return data;
  };

  const calcDifference = (obj1, obj2) => {
    const addSign = '+';
    const removeSign = '-';

    const inner = (obj, pathToValue) => {
      const keys = Object.keys(obj);
      const sortedKeys = _.sortBy(keys);
      const result = sortedKeys.reduce((acc, key) => {
        const fullPath = `${pathToValue}${key}`;
        const addedKey = `${addSign} ${key}`;
        const removedKey = `${removeSign} ${key}`;
        const valueBefore = _.get(obj1, fullPath);
        const valueAfter = _.get(obj2, fullPath);
        if (!_.has(obj1, fullPath)) {
          return { ...acc, [addedKey]: valueAfter };
        }
        if (!_.has(obj2, fullPath)) {
          return { ...acc, [removedKey]: valueBefore };
        }
        // if (_.isObjectLike(valueAfter) && _.isObjectLike(valueBefore)) {
        if (_.isObjectLike(obj[key])) {
          return { ...acc, [key]: inner(obj[key], `${fullPath}.`) };
        }
        if (valueBefore !== valueAfter) {
          return { ...acc, [removedKey]: valueBefore, [addedKey]: valueAfter };
        }
        return { ...acc, [key]: valueBefore };
      }, {});
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

  // if (formatName === 'plain') {
  //   const formattedDiff = plain(difference);
  //   return formattedDiff;
  // }
  // if (formatFuncName !== '') {
  //   throw new Error('non supported format option');
  // }
  const formatedDiff = format(difference, formatName);
  return formatedDiff;
};
