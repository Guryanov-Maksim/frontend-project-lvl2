import _ from 'lodash';

const isComplex = (value) => _.isObjectLike(value);

const normalizeValue = (value) => {
  if (isComplex(value)) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

export default (object) => {
  const removeSign = '-';
  const addSign = '+';

  const inner = (obj, pathToKey) => {
    const keys = Object.keys(obj);
    const result = keys.map((key, index) => {
      const fullPath = pathToKey.concat(`${key}`);
      const [, keyWithouSign] = key.split(' ');
      const fullPath1 = pathToKey.concat(`${keyWithouSign}`);
      const value = obj[key];
      const normalizedValue = normalizeValue(value);
      if (key.startsWith(addSign)) {
        const prevKey = keys[index - 1];
        const prevValue = normalizeValue(obj[prevKey]);
        if (`${removeSign} ${keyWithouSign}` === prevKey) {
          return `Property '${fullPath1}' was updated. From ${prevValue} to ${normalizedValue}`;
        }
        return `Property '${fullPath1}' was added with value: ${normalizedValue}`;
      }
      if (key.startsWith(removeSign)) {
        const nextKey = keys[index + 1];
        if (`${addSign} ${keyWithouSign}` === nextKey) {
          return '';
        }
        return `Property '${fullPath1}' was removed`;
      }
      if (_.isObjectLike(value)) {
        return inner(value, `${fullPath}.`, `${fullPath1}.`);
      }
      return '';
    });

    return result.filter((item) => item !== '').join('\n');
  };
  return inner(object, '');
};
