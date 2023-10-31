import { TBeforeRequest } from '@automatisch/types';
import jwt from 'jsonwebtoken';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  const key = $.auth.data?.apiKey as string;

  if (key) {
    const [id, secret] = key.split(':');

    const token = jwt.sign({}, Buffer.from(secret, 'hex'), {
      keyid: id,
      algorithm: 'HS256',
      expiresIn: '1h',
      audience: `/admin/`,
    });

    requestConfig.headers.Authorization = `Ghost ${token}`;
  }

  return requestConfig;
};

export default addAuthHeader;
