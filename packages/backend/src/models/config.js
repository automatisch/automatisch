import Base from './base.js';

class Config extends Base {
  static tableName = 'config';

  static jsonSchema = {
    type: 'object',
    required: ['key', 'value'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      key: { type: 'string', minLength: 1 },
      value: { type: 'object' },
    },
  };

  static async isInstallationCompleted() {
    const installationCompletedEntry = await this.query()
      .where({
        key: 'installation.completed',
      })
      .first();

    const installationCompleted =
      installationCompletedEntry?.value?.data === true;

    return installationCompleted;
  }

  static async markInstallationCompleted() {
    return await this.query().insert({
      key: 'installation.completed',
      value: {
        data: true,
      },
    });
  }

  static async batchUpdate(config) {
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

    return await Promise.all(updates);
  }
}

export default Config;
