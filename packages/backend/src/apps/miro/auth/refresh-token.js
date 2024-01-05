import { URLSearchParams } from 'node:url';

const refreshToken = async ($) => {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: $.auth.data.clientId,
    client_secret: $.auth.data.clientSecret,
    refresh_token: $.auth.data.refreshToken,
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
