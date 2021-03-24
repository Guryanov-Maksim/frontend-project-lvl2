import plain from './plain.js';
import stylish from './strylish.js';
import makeJson from './json.js';

export default (obj, formatterName) => {
  switch (formatterName) {
    case 'json':
      return JSON.stringify(makeJson(obj), null, '  ');
    case 'plain':
      return plain(obj);
    default:
      return stylish(obj);
  }
};
