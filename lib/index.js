import path from 'path';
import fs from 'fs';
import parse from '../src/parser.js';
import format from '../formatters/index.js';
import makeDiffTree from '../src/tree.js';

const readFile = (pathToFile) => {
  const fullPath = path.resolve(process.cwd(), pathToFile);
  const data = fs.readFileSync(fullPath, 'utf-8');
  return data;
};

export default (filePath1, filePath2, formatName) => {
  const file1Extention = path.extname(filePath1);
  const file2Extention = path.extname(filePath2);
  const data1 = readFile(filePath1);
  const data2 = readFile(filePath2);
  const obj1 = parse(file1Extention, data1);
  const obj2 = parse(file2Extention, data2);
  const difference = makeDiffTree(obj1, obj2);
  const formatedDiff = format(difference, formatName);
  return formatedDiff;
};
