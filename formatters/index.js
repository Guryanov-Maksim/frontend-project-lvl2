import plain from './plain.js';
import stylish from './strylish.js';
import makeObjFromDiff from './json.js';

export default (diffTree, format = 'stylish') => {
  switch (format) {
    case 'json':
      return JSON.stringify(makeObjFromDiff(diffTree));
    case 'plain':
      return plain(diffTree);
    case 'stylish':
      return stylish(diffTree);
    default:
      throw new Error(`non supported format: ${format}`);
  }
};
