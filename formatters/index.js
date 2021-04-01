import plain from './plain.js';
import stylish from './strylish.js';
import makeJsonString from './json.js';

export default (diffTree, format = 'stylish') => {
  switch (format) {
    case 'json':
      return makeJsonString(diffTree);
    case 'plain':
      return plain(diffTree);
    case 'stylish':
      return stylish(diffTree);
    default:
      throw new Error(`non supported format: ${format}`);
  }
};
