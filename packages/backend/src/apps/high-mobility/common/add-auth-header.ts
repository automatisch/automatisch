import { TBeforeRequest } from '@automatisch/types';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  const { accessToken } = $.auth.data;
  const { url } = requestConfig;

  if (accessToken && url === '/v1/vehicleinfo') {
    requestConfig.headers.Authorization = `Bearer ${accessToken}`;
    return requestConfig;
  }

  const config = {
    version: '3.0',
    type: 'rest_api',
    private_key: ($.auth.data.privateKey as string).replaceAll('\\n', '\n'),
    app_uri: 'https://sandbox.rest-api.high-mobility.com/v5',
    app_id: $.auth.data.appId as string,
    client_serial_number: $.auth.data.clientSerialNumber as string,
  };

  const payload = {
    ver: config.version,
    aud: config.app_uri,
    iss: config.client_serial_number,
    iat: Math.round(Date.now() / 1000),
    jti: uuidv4(),
    sub: $.auth.data.accessToken,
  };

  const priv = Buffer.from(config.private_key, 'utf8');

  const token = jwt.sign(payload, priv, { algorithm: 'ES256' });

  requestConfig.headers.Authorization = `Bearer ${token}`;

  return requestConfig;
};

export default addAuthHeader;
