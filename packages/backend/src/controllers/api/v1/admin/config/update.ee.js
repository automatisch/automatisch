import pick from 'lodash/pick.js';
import { renderObject } from '../../../../../helpers/renderer.js';
import Config from '../../../../../models/config.js';

export default async (request, response) => {
  const config = configParams(request);
  const configKeys = Object.keys(config);
  const updates = [];

  for (const key of configKeys) {
    const newValue = config[key];

    if (newValue) {
      const entryUpdate = Config.query()
        .insert({
          key,
          value: {
            data: newValue,
          },
        })
        .onConflict('key')
        .merge({
          value: {
            data: newValue,
          },
        });

      updates.push(entryUpdate);
    } else {
      const entryUpdate = Config.query().findOne({ key }).delete();
      updates.push(entryUpdate);
    }
  }

  await Promise.all(updates);

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
