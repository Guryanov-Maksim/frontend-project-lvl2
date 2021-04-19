import { test, expect } from '@jest/globals';
import url from 'url';
import path from 'path';
import fs from 'fs';
import getDifference from '../src/index.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const extentions = ['yml', 'json'];
const formats = ['stylish', 'plain', 'json'];
const combinations = extentions.flatMap((extention) => (
  formats.map((format) => [extention, format])
));
const expectedResults = Object.fromEntries(
  formats.map((format) => [format, readFile(`result_${format}.txt`)]),
);

test.each(combinations)('compare two %s files and output in %s format', (dataFormat, format) => {
  const pathBefore = getFixturePath(`before.${dataFormat}`);
  const pathAfter = getFixturePath(`after.${dataFormat}`);
  const result = getDifference(pathBefore, pathAfter, format);
  expect(result).toEqual(expectedResults[format]);
});

test('default behavior', () => {
  const pathBefore = getFixturePath('before.json');
  const pathAfter = getFixturePath('after.json');
  const result = getDifference(pathBefore, pathAfter);
  expect(result).toEqual(expectedResults.stylish);
  expect(() => getDifference(pathBefore, pathAfter, 'wrong')).toThrow();
});
