import crypto from 'crypto';
import AccessToken from '../../src/models/access-token.js';
import { createUser } from './user.js';

export const createAccessToken = async (params = {}) => {
  params.userId = params.userId || (await createUser()).id;
  params.token = params.token || (await crypto.randomBytes(48).toString('hex'));
  params.expiresIn = params.expiresIn || 14 * 24 * 60 * 60; // 14 days in seconds

  const accessToken = await AccessToken.query().insertAndFetch(params);

  return accessToken;
};
