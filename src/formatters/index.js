import plain from './plain.js';
import stylish from './strylish.js';

export default (diffTree, format = 'stylish') => {
  switch (format) {
    case 'json':
      return JSON.stringify(diffTree, null, 2);
    case 'plain':
      return plain(diffTree);
    case 'stylish':
      return stylish(diffTree);
    default:
      throw new Error(`non supported format: ${format}`);
  }
};
