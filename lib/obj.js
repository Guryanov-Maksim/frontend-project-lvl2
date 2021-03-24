import _ from 'lodash';

export default (item) => {
  if (_.isObjectLike(item) && !Array.isArray(item)) {
    return true;
  }
  return false;
};
