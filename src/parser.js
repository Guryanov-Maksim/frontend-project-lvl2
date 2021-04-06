import yaml from 'js-yaml';

export default (dataFormat, data) => {
  switch (dataFormat) {
    case '.yml':
      return yaml.load(data);
    case '.json':
      return JSON.parse(data);
    default:
      throw new Error(`non supported data format: ${dataFormat}`);
  }
};
