import jwt from 'jsonwebtoken';
import appConfig from '../config/app';

const TOKEN_EXPIRES_IN = '14d';

const createAuthTokenByUserId = (userId: string) => {
  const token = jwt.sign({ userId }, appConfig.appSecretKey, {
    expiresIn: TOKEN_EXPIRES_IN,
  });

  return token;
};

export default createAuthTokenByUserId;
