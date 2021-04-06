import { test, expect, beforeAll } from '@jest/globals';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import getDifference from '../src/index.js';

const expectedResults = {};

const { dirname } = path;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

beforeAll(() => {
  const defaultResult = readFile('result.txt');
  const plainResult = readFile('plainResult.txt');
  const jsonResult = readFile('jsonResult.json');

  /* eslint-disable no-alert, fp/no-mutation */
  expectedResults.stylish = defaultResult;
  expectedResults.plain = plainResult;
  expectedResults.json = jsonResult;
  /* eslint-enable no-alert, fp/no-mutation */
});

test.each([
  'json',
  'yml',
])('compare two %s files', (extention) => {
  const pathToBefore = getFixturePath(`before.${extention}`);
  const pathToAfter = getFixturePath(`after.${extention}`);
  const result = getDifference(pathToBefore, pathToAfter);
  expect(result).toEqual(expectedResults.stylish);
});

test.each([
  'stylish',
  'plain',
  'json',
])('output the difference in various formats (%s format)', (format) => {
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
