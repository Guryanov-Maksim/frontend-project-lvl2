import path from 'path';
import fs from 'fs';
import parse from './parser.js';
import format from './formatters/index.js';
import makeDiffTree from './tree.js';

const readFile = (pathToFile) => {
  const fullPath = path.resolve(process.cwd(), pathToFile);
  const data = fs.readFileSync(fullPath, 'utf-8');
  return data;
};

const getDataFormat = (extention) => extention
  .split('')
  .filter((letter) => letter !== '.')
  .join('');

export default (filePath1, filePath2, formatName) => {
  const data1Format = getDataFormat(path.extname(filePath1));
  const data2Format = getDataFormat(path.extname(filePath1));
  const data1 = readFile(filePath1);
  const data2 = readFile(filePath2);
  const obj1 = parse(data1Format, data1);
  const obj2 = parse(data2Format, data2);
  const difference = makeDiffTree(obj1, obj2);
  const formatedDiff = format(difference, formatName);
  return formatedDiff;
};
