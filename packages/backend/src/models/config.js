import Base from './base.js';

class Config extends Base {
  static tableName = 'config';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'string', format: 'uuid' },
      installationCompleted: { type: 'boolean' },
      logoSvgData: { type: ['string', 'null'] },
      palettePrimaryDark: { type: ['string', 'null'] },
      palettePrimaryLight: { type: ['string', 'null'] },
      palettePrimaryMain: { type: ['string', 'null'] },
      title: { type: ['string', 'null'] },
    },
  };

  static async get() {
    const existingConfig = await this.query().limit(1).first();

    if (!existingConfig) {
      return await this.query().insertAndFetch({});
    }

    return existingConfig;
  }

  static async update(config) {
    const configEntry = await this.get();

    return await configEntry.$query().patchAndFetch(config);
  }

  static async isInstallationCompleted() {
    const config = await this.get();

    return config.installationCompleted;
  }

  static async markInstallationCompleted() {
    const config = await this.get();

    return await config.$query().patchAndFetch({
      installationCompleted: true,
    });
  }
}

export default Config;
