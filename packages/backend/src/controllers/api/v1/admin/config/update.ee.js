import pick from 'lodash/pick.js';
import { renderObject } from '../../../../../helpers/renderer.js';
import Config from '../../../../../models/config.js';

export default async (request, response) => {
  const config = configParams(request);

  await Config.batchUpdate(config);

  renderObject(response, config);
};

const configParams = (request) => {
  const updatableConfigurationKeys = [
    'logo.svgData',
    'palette.primary.dark',
    'palette.primary.light',
    'palette.primary.main',
    'title',
  ];

  return pick(request.body, updatableConfigurationKeys);
};
