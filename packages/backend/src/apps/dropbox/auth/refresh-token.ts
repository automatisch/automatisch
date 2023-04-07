import { Buffer } from 'node:buffer';
import { IGlobalVariable } from '@automatisch/types';

const refreshToken = async ($: IGlobalVariable) => {
  const params = {
    grant_type: 'refresh_token',
    refresh_token: $.auth.data.refreshToken as string,
  };

  const basicAuthToken = Buffer
    .from(`${$.auth.data.clientId}:${$.auth.data.clientSecret}`)
    .toString('base64');

  const { data } = await $.http.post(
    'oauth2/token',
    null,
    {
      params,
      headers: {
        Authorization: `Basic ${basicAuthToken}`
      },
      additionalProperties: {
        skipAddingAuthHeader: true
      }
    }
  );

  const {
    access_token: accessToken,
    expires_in: expiresIn,
    token_type: tokenType,
  } = data;

  await $.auth.set({
    accessToken,
    expiresIn,
    tokenType,
  });
};

export default refreshToken;
