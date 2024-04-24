import authScope from '../common/auth-scope.js';

const refreshToken = async ($) => {

  const {data} = await $.http.post(
    `https://login.microsoftonline.com/${$.auth.data.tenantId}/oauth2/v2.0/token`,
    {
      client_id: $.auth.data.clientId,
      client_secret: $.auth.data.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: $.auth.data.refreshToken,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  await $.auth.set({
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    scope: authScope.join(' '),
    tokenType: data.token_type,
  });
};

export default refreshToken;
