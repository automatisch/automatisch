import pick from 'lodash/pick.js';
import { renderObject } from '../../../../../helpers/renderer.js';
import Config from '../../../../../models/config.js';

export default async (request, response) => {
  const updatedConfig = await Config.update(configParams(request));

  renderObject(response, updatedConfig);
};

const configParams = (request) => {
  const updatableConfigurationKeys = [
    'logoSvgData',
    'palettePrimaryDark',
    'palettePrimaryLight',
    'palettePrimaryMain',
    'title',
  ];

  return pick(request.body, updatableConfigurationKeys);
};
