import Config from '../../models/config.js';

const updateConfig = async (_parent, params, context) => {
  context.currentUser.can('update', 'Config');

  const config = params.input;
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

  return config;
};

export default updateConfig;
