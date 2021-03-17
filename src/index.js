import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import parse from './parsers.js';

export default (filePath1, filePath2) => {
  const addSign = '+';
  const removeSign = '-';
  const unchangeSign = ' ';
  const tab = '  ';
  const file1Extention = path.extname(filePath1);
  const file2Extention = path.extname(filePath2);
  const readFile = (pathToFile) => {
    const fullPath = path.resolve(process.cwd(), pathToFile);
    const data = fs.readFileSync(fullPath, 'utf-8');
    return data;
  };

  const data1 = readFile(filePath1);
  const data2 = readFile(filePath2);
  const obj1 = parse(file1Extention, data1);
  const obj2 = parse(file2Extention, data2);
  const joinedObj = { ...obj1, ...obj2 };
  const keys = Object.keys(joinedObj);
  const sortedKeys = _.sortBy(keys);
  const difference = sortedKeys.map((key) => {
    if (!_.has(obj1, key)) {
      return `${tab}${addSign} ${key}: ${obj2[key]}`;
    }
    if (!_.has(obj2, key)) {
      return `${tab}${removeSign} ${key}: ${obj1[key]}`;
    }
    if (obj1[key] !== obj2[key]) {
      return `${tab}${removeSign} ${key}: ${obj1[key]}\n${tab}${addSign} ${key}: ${obj2[key]}`;
    }
    return `${tab}${unchangeSign} ${key}: ${obj1[key]}`;
  });
  return `{\n${difference.join('\n')}\n}`;
};
