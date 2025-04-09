import crypto from 'crypto';
import ApiToken from '../../src/models/api-token.ee.js';

export const createApiToken = async (params = {}) => {
  params.token = params.token || crypto.randomBytes(48).toString('hex');

  const apiToken = await ApiToken.query().insertAndFetch(params);

  return apiToken;
};
