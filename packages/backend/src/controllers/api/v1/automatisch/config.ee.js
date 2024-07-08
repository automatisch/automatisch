import appConfig from '../../../../config/app.js';
import Config from '../../../../models/config.js';
import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const defaultConfig = {
    disableNotificationsPage: appConfig.disableNotificationsPage,
    disableFavicon: appConfig.disableFavicon,
    additionalDrawerLink: appConfig.additionalDrawerLink,
    additionalDrawerLinkIcon: appConfig.additionalDrawerLinkIcon,
    additionalDrawerLinkText: appConfig.additionalDrawerLinkText,
  };

  let config = await Config.query().orderBy('key', 'asc');

  config = config.reduce((computedConfig, configEntry) => {
    const { key, value } = configEntry;

    computedConfig[key] = value?.data;

    return computedConfig;
  }, defaultConfig);

  renderObject(response, config);
};
