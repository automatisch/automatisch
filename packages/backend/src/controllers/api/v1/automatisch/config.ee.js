import appConfig from '../../../../config/app.js';
import Config from '../../../../models/config.js';
import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const staticConfig = {
    disableNotificationsPage: appConfig.disableNotificationsPage,
    disableFavicon: appConfig.disableFavicon,
    additionalDrawerLink: appConfig.additionalDrawerLink,
    additionalDrawerLinkIcon: appConfig.additionalDrawerLinkIcon,
    additionalDrawerLinkText: appConfig.additionalDrawerLinkText,
  };

  const dynamicConfig = await Config.get();

  const dynamicAndStaticConfig = {
    ...dynamicConfig,
    ...staticConfig,
  };

  renderObject(response, dynamicAndStaticConfig);
};
