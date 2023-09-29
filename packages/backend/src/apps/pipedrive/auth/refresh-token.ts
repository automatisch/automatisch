import { URLSearchParams } from 'node:url';
import { IGlobalVariable } from '@automatisch/types';

const refreshToken = async ($: IGlobalVariable) => {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: $.auth.data.refreshToken as string,
  });

  const headers = {
    Authorization: `Basic ${Buffer.from(
      $.auth.data.clientId + ':' + $.auth.data.clientSecret
    ).toString('base64')}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const response = await $.http.post(
    'https://oauth.pipedrive.com/oauth/token',
    params.toString(),
    {
      headers,
      additionalProperties: {
        skipAddingAuthHeader: true,
      },
    }
  );

  await $.auth.set({
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
    tokenType: response.data.token_type,
    expiresIn: response.data.expires_in,
  });
};

export default refreshToken;
