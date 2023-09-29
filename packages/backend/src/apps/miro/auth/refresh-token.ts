import { URLSearchParams } from 'node:url';
import { IGlobalVariable } from '@automatisch/types';

const refreshToken = async ($: IGlobalVariable) => {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: $.auth.data.clientId as string,
    client_secret: $.auth.data.clientSecret as string,
    refresh_token: $.auth.data.refreshToken as string,
  });

  const { data } = await $.http.post('/v1/oauth/token', params.toString());

  await $.auth.set({
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token,
    scope: data.scope,
    tokenType: data.token_type,
  });
};

export default refreshToken;
