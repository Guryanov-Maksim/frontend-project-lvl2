import { test, expect, beforeAll } from '@jest/globals';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import getDifference from '../src/index.js';

const { dirname } = path;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

let expectedResult;

beforeAll(() => {
  expectedResult = readFile('result.txt');
});

test('compare two JSON-files', () => {
  const beforePath = getFixturePath('before.json');
  const afterPath = getFixturePath('after.json');
  const result = getDifference(beforePath, afterPath, 'stylish');

  expect(result).toEqual(expectedResult);
});

test('compare two YML-files', () => {
  const beforePath = getFixturePath('before.yml');
  const afterPath = getFixturePath('after.yml');
  const result = getDifference(beforePath, afterPath, 'stylish');

  expect(result).toEqual(expectedResult);
});

test('output plane result', () => {
  const beforePath = getFixturePath('before.json');
  const afterPath = getFixturePath('after.json');
  const result = getDifference(beforePath, afterPath, 'plain');
  const expectedPlainResult = readFile('plainResult.txt');
  expect(result).toEqual(expectedPlainResult);
});

test('JSON output', () => {
  const beforePath = getFixturePath('before.json');
  const afterPath = getFixturePath('after.json');
  const result = getDifference(beforePath, afterPath, 'json');
  const expectedJsonResult = readFile('jsonResult.json');
  expect(result).toEqual(expectedJsonResult);
});
