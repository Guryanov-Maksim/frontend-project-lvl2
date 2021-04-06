import yaml from 'js-yaml';

export default (fileExtention, data) => {
  switch (fileExtention) {
    case '.yml':
      return yaml.load(data);
    case '.json':
      return JSON.parse(data);
    default:
      throw new Error(`non supported data format: ${fileExtention}`);
  }
};
