import plain from './plain.js';
import stylish from './strylish.js';
import makeJson from './json.js';

export default (obj, formatterName = 'stylish') => {
  switch (formatterName) {
    case 'json':
      return JSON.stringify(makeJson(obj), null, '  ');
    case 'plain':
      return plain(obj);
    case 'stylish':
      return stylish(obj);
    default:
      throw new Error('non supported format');
  }
};
