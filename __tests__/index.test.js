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

/*

Твое замечание: "По самим тестам, получается много похожего кода.
Здесь приходит на помощь jest each, который может обрабатывать сразу несколько параметров."

Мой вопрос: правильно ли я исправил, применив test.each? На вид будто страшнее стало, чем было.

=======================
Твое замечание: "Так же стоит проверить не переданный форматер."

Мои вопросы:
1. При сравнении файлов json и yml в первом test.each функция genDiff() вызывается без форматтера.
  Этой проверки не досточно? Или нужен явный вызов genDiff() без форматтера?
2. Я хотел сделать вызов genDiff() без форматтера во втором test.each
  (вместо форматтера задать пустую строку), но тогда название этого теста получается
  урезанным: "output the difference in various formats ( format)". Что-то не придумаю,
  как мне поступить.

===============
  Твое замечание: "И, как вариант, валидность json через JSON.parse."

  Мой вопрос: поясни, пожалуйста, что ты имел ввиду?
*/

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
  ${() => paths.jsonBefore} | ${() => paths.jsonAfter} | ${() => results.default} | ${'wrong'}
`('output the difference in various formats ($format format)', ({
  getBefore,
  getAfter,
  getExpected,
  format,
}) => {
  const result = getDifference(getBefore(), getAfter(), format);
  expect(result).toEqual(getExpected());
});

// test('compare two JSON-files', () => {
//   const beforePath = getFixturePath('before.json');
//   const afterPath = getFixturePath('after.json');
//   const result = getDifference(beforePath, afterPath);
//   const expectedResult = readFile('result.txt');
//   expect(result).toEqual(expectedResult);
// });

// test('compare two YML-files', () => {
//   const beforePath = getFixturePath('before.yml');
//   const afterPath = getFixturePath('after.yml');
//   const result = getDifference(beforePath, afterPath);
//   const expectedResult = readFile('result.txt');
//   expect(result).toEqual(expectedResult);
// });

// test('output plane result', () => {
//   const beforePath = getFixturePath('before.json');
//   const afterPath = getFixturePath('after.json');
//   const result = getDifference(beforePath, afterPath, 'plain');
//   const expectedPlainResult = readFile('plainResult.txt');
//   expect(result).toEqual(expectedPlainResult);
// });

// test('JSON output', () => {
//   const beforePath = getFixturePath('before.json');
//   const afterPath = getFixturePath('after.json');
//   const result = getDifference(beforePath, afterPath, 'json');
//   const expectedJsonResult = readFile('jsonResult.json');
//   expect(result).toEqual(expectedJsonResult);
// });
