import { test, expect, beforeAll } from '@jest/globals';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import getDifference from '../lib/index.js';

const results = {};
const paths = {};

const { dirname } = path;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

beforeAll(() => {
  const defaultResult = readFile('result.txt');
  const plainResult = readFile('plainResult.txt');
  const jsonResult = readFile('jsonResult.json');
  const pathToJsonBefore = getFixturePath('before.json');
  const pathToJsonAfter = getFixturePath('after.json');
  const pathToYmlBefore = getFixturePath('before.yml');
  const pathToYmlAfter = getFixturePath('after.yml');

  // eslint-disable-next-line fp/no-mutation
  results.default = defaultResult;
  // eslint-disable-next-line fp/no-mutation
  results.plain = plainResult;
  // eslint-disable-next-line fp/no-mutation
  results.json = jsonResult;
  // eslint-disable-next-line fp/no-mutation
  paths.jsonBefore = pathToJsonBefore;
  // eslint-disable-next-line fp/no-mutation
  paths.jsonAfter = pathToJsonAfter;
  // eslint-disable-next-line fp/no-mutation
  paths.ymlBefore = pathToYmlBefore;
  // eslint-disable-next-line fp/no-mutation
  paths.ymlAfter = pathToYmlAfter;
});

test.each`
  getBefore                 | getAfter                 | getExpected              | type
  ${() => paths.jsonBefore} | ${() => paths.jsonAfter} | ${() => results.default} | ${'json'}
  ${() => paths.ymlBefore}  | ${() => paths.ymlAfter}  | ${() => results.default} | ${'yml'}
`('compare two $type files', ({ getBefore, getAfter, getExpected }) => {
  const result = getDifference(getBefore(), getAfter());
  expect(result).toEqual(getExpected());
});

test.each`
  getBefore                 | getAfter                 | getExpected              | format
  ${() => paths.jsonBefore} | ${() => paths.jsonAfter} | ${() => results.default} | ${'stylish'}
  ${() => paths.jsonBefore} | ${() => paths.jsonAfter} | ${() => results.plain}   | ${'plain'}
  ${() => paths.jsonBefore} | ${() => paths.jsonAfter} | ${() => results.json}    | ${'json'}
`('output the difference in various formats ($format format)', ({
  getBefore,
  getAfter,
  getExpected,
  format,
}) => {
  const result = getDifference(getBefore(), getAfter(), format);
  expect(result).toEqual(getExpected());
});

test('non supported formatter', () => {
  expect(() => getDifference(paths.jsonBefore, paths.jsonAfter, 'wrong')).toThrow();
});
