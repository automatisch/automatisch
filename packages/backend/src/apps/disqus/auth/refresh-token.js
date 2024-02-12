import { URLSearchParams } from 'node:url';
import authScope from '../common/auth-scope.js';

const refreshToken = async ($) => {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: $.auth.data.apiKey,
    client_secret: $.auth.data.apiSecret,
    refresh_token: $.auth.data.refreshToken,
  });

  const { data } = await $.http.post(
    `https://disqus.com/api/oauth/2.0/access_token/`,
    params.toString()
  );

  await $.auth.set({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    scope: authScope.join(','),
    tokenType: data.token_type,
  });
};

export default refreshToken;
