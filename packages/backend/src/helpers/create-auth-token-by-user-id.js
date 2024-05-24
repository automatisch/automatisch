import crypto from 'crypto';
import User from '../models/user.js';
import AccessToken from '../models/access-token.js';

const TOKEN_EXPIRES_IN = 14 * 24 * 60 * 60; // 14 days in seconds

const createAuthTokenByUserId = async (userId, samlSessionId) => {
  const user = await User.query().findById(userId).throwIfNotFound();
  const token = await crypto.randomBytes(48).toString('hex');

  await AccessToken.query().insert({
    token,
    samlSessionId,
    userId: user.id,
    expiresIn: TOKEN_EXPIRES_IN,
  });

  return token;
};

export default createAuthTokenByUserId;
