import { URLSearchParams } from 'node:url';

import authScope from '../common/auth-scope.js';

const refreshToken = async ($) => {
  const headers = {
    Authorization: `Basic ${Buffer.from(
      $.auth.data.clientId + ':' + $.auth.data.clientSecret
    ).toString('base64')}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: $.auth.data.refreshToken,
  });

  const { data } = await $.http.post(
    'https://identity.xero.com/connect/token',
    params.toString(),
    {
      headers,
      additionalProperties: {
        skipAddingAuthHeader: true,
      },
    }
  );

  await $.auth.set({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    idToken: data.id_token,
    scope: authScope.join(' '),
    tokenType: data.token_type,
  });
};

export default refreshToken;
