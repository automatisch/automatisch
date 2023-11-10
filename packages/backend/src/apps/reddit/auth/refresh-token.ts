import { URLSearchParams } from 'node:url';
import { IGlobalVariable } from '@automatisch/types';

const refreshToken = async ($: IGlobalVariable) => {
  const headers = {
    Authorization: `Basic ${Buffer.from(
      $.auth.data.clientId + ':' + $.auth.data.clientSecret
    ).toString('base64')}`,
  };
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: $.auth.data.refreshToken as string,
  });

  const { data } = await $.http.post(
    'https://www.reddit.com/api/v1/access_token',
    params.toString(),
    { headers }
  );

  await $.auth.set({
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    scope: data.scope,
    tokenType: data.token_type,
  });
};

export default refreshToken;
