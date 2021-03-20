import _ from 'lodash';

export default (object) => {
  const space = ' ';
  const spaceCount = 4;
  const inner = (obj, depth) => {
    const keys = Object.keys(obj);
    const entryUndent = space.repeat(depth * spaceCount);
    const endUndent = space.repeat((depth - 1) * spaceCount);
    const result = keys.map((key) => {
      const value = obj[key];
      const undent = key.startsWith('+') || key.startsWith('-')
        ? entryUndent.slice(0, entryUndent.length - 2)
        : entryUndent;
      if (_.isObjectLike(value)) {
        return `${undent}${key}: ${inner(value, depth + 1)}`;
      }
      return `${undent}${key}: ${value}`;
    });
    return `{\n${result.join('\n')}\n${endUndent}}`;
  };
  return inner(object, 1);
};
