import appConfig from '../../../../config/app.js';
import { hasValidLicense } from '../../../../helpers/license.ee.js';
import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const info = {
    isCloud: appConfig.isCloud,
    isMation: appConfig.isMation,
    isEnterprise: await hasValidLicense(),
  };

  renderObject(response, info);
};
