import plain from './plain.js';
import stylish from './strylish.js';

export default (obj, formatterName) => {
  switch (formatterName) {
    case 'plain':
      return plain(obj);
    case 'stylish':
      return stylish(obj);
    default:
      throw new Error('non supported format');
  }
};