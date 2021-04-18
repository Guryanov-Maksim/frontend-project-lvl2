import { test, expect } from '@jest/globals';
import url from 'url';
import path from 'path';
import fs from 'fs';
import getDifference from '../src/index.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const formats = ['stylish', 'plain', 'json'];
const expectedResults = Object.fromEntries(
  formats.map((format) => [format, readFile(`result_${format}.txt`)]),
);

test.each([
  ['yml', 'stylish'],
  ['json', 'stylish'],
  ['json', 'plain'],
  ['json', 'json'],
])('compare two %s files and output in %s format', (dataFormat, format) => {
  const pathToBefore = getFixturePath(`before.${dataFormat}`);
  const pathToAfter = getFixturePath(`after.${dataFormat}`);
  const result = getDifference(pathToBefore, pathToAfter, format);
  expect(result).toEqual(expectedResults[format]);
});

test('default behavior', () => {
  const pathToBefore = getFixturePath('before.json');
  const pathToAfter = getFixturePath('after.json');
  const result = getDifference(pathToBefore, pathToAfter);
  expect(result).toEqual(expectedResults.stylish);
  expect(() => getDifference(pathToBefore, pathToAfter, 'wrong')).toThrow();
});
