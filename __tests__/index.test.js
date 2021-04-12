import _ from 'lodash';
import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import getDifference from '../src/index.js';

const fileTypes = ['json', 'yml'];
const formats = ['stylish', 'plain', 'json'];

const { dirname } = path;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');
const resultsForEachFormat = formats.map((format) => readFile(`result_${format}.txt`));
const expectedResults = Object.fromEntries(_.zip(formats, resultsForEachFormat));

test.each(fileTypes)('compare two %s files', (extention) => {
  const pathToBefore = getFixturePath(`before.${extention}`);
  const pathToAfter = getFixturePath(`after.${extention}`);
  const result = getDifference(pathToBefore, pathToAfter);
  expect(result).toEqual(expectedResults.stylish);
});

test.each(formats)('output the difference in various formats (%s format)', (format) => {
  const pathToBefore = getFixturePath('before.json');
  const pathToAfter = getFixturePath('after.json');
  const result = getDifference(pathToBefore, pathToAfter, format);
  expect(result).toEqual(expectedResults[format]);
});

test('non supported formatter', () => {
  const pathToBefore = getFixturePath('before.json');
  const pathToAfter = getFixturePath('after.json');
  expect(() => getDifference(pathToBefore, pathToAfter, 'wrong')).toThrow();
});
