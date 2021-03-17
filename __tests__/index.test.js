import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import getDifference from '../src/index.js';

const { dirname } = path;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test('compare two JSON-files', () => {
  const beforePath = getFixturePath('before.json');
  const afterPath = getFixturePath('after.json');
  const expectedResult = readFile('result.txt');
  const result = getDifference(beforePath, afterPath);

  expect(result).toEqual(expectedResult);
});

test('compare two YML-files', () => {
  const beforePath = getFixturePath('before.yml');
  const afterPath = getFixturePath('after.yml');
  const expectedResult = readFile('result.txt');
  const result = getDifference(beforePath, afterPath);

  expect(result).toEqual(expectedResult);
});
