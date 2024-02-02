import jwt from 'jsonwebtoken';

const addAuthHeader = ($, requestConfig) => {
  const key = $.auth.data?.apiKey;

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
