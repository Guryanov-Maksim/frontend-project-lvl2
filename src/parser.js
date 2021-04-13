import yaml from 'js-yaml';

export default (dataFormat, data) => {
  const fileType = dataFormat
    .split('')
    .filter((letter) => letter !== '.')
    .join('');
  switch (fileType) {
    case 'yml':
      return yaml.load(data);
    case 'json':
      return JSON.parse(data);
    default:
      throw new Error(`non supported data format: ${fileType}`);
  }
};
