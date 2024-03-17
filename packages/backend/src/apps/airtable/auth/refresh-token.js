import { URLSearchParams } from 'node:url';

import authScope from '../common/auth-scope.js';

const refreshToken = async ($) => {
  const params = new URLSearchParams({
    client_id: $.auth.data.clientId,
    grant_type: 'refresh_token',
    refresh_token: $.auth.data.refreshToken,
  });

  const basicAuthToken = Buffer.from(
    $.auth.data.clientId + ':' + $.auth.data.clientSecret
  ).toString('base64');

  const { data } = await $.http.post(
    'https://airtable.com/oauth2/v1/token',
    params.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basicAuthToken}`,
      },
      additionalProperties: {
        skipAddingAuthHeader: true,
      },
    }
  );

  await $.auth.set({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    refreshExpiresIn: data.refresh_expires_in,
    scope: authScope.join(' '),
    tokenType: data.token_type,
  });
};

export default refreshToken;
