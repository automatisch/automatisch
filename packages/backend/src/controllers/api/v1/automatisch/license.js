import { getLicense } from '../../../../helpers/license.ee.js';
import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const license = await getLicense();

  const computedLicense = {
    id: license ? license.id : null,
    name: license ? license.name : null,
    expireAt: license ? license.expireAt : null,
    verified: license ? true : false,
  };

  renderObject(response, computedLicense);
};
