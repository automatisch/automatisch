import appConfig from '../config/app.js';
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
      enableTemplates: { type: ['boolean', 'null'] },
      enableFooter: { type: 'boolean' },
      footerLogoSvgData: { type: ['string', 'null'] },
      footerCopyrightText: { type: ['string', 'null'] },
      footerBackgroundColor: { type: ['string', 'null'] },
      footerTextColor: { type: ['string', 'null'] },
      footerDocsUrl: { type: ['string', 'null'] },
      footerTosUrl: { type: ['string', 'null'] },
      footerPrivacyPolicyUrl: { type: ['string', 'null'] },
      footerImprintUrl: { type: ['string', 'null'] },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static get virtualAttributes() {
    return [
      'disableNotificationsPage',
      'disableFavicon',
      'additionalDrawerLink',
      'additionalDrawerLinkIcon',
      'additionalDrawerLinkText',
    ];
  }

  get disableNotificationsPage() {
    return appConfig.disableNotificationsPage;
  }

  get disableFavicon() {
    return appConfig.disableFavicon;
  }

  get additionalDrawerLink() {
    return appConfig.additionalDrawerLink;
  }

  get additionalDrawerLinkIcon() {
    return appConfig.additionalDrawerLinkIcon;
  }

  get additionalDrawerLinkText() {
    return appConfig.additionalDrawerLinkText;
  }

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
