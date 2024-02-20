import { hasValidLicense } from './license.ee.js';

export const checkIsEnterprise = async (request, response, next) => {
  if (await hasValidLicense()) {
    next();
  } else {
    return response.status(404).end();
  }
};
