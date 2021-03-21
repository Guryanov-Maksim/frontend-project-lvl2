import _ from 'lodash';

export default (object) => {
  const inner = (obj, depth) => {
    const keys = Object.keys(obj);
    const result = keys.map((key) => {
      const value = (typeof obj[key] === 'string')
        ? `"${obj[key]}"`
        : obj[key];
      if (_.isObjectLike(value)) {
        return `"${key}": ${inner(value, depth + 1)}`;
      }
      return `"${key}": ${value}`;
    });
    return `{${result.join(',')}}`;
  };
  return inner(object, 1);
};
