import { URLSearchParams } from 'url';

const verifyCredentials = async ($) => {
  const oauthRedirectUrl = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  ).value;

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: $.auth.data.code,
    client_id: $.auth.data.clientId,
    client_secret: $.auth.data.clientSecret,
    redirect_uri: oauthRedirectUrl,
  });

  const { data: verifiedCredentials } = await $.http.post(
    '/oauth/token',
    params.toString()
  );

  const {
    access_token: accessToken,
    expires_in: expiresIn,
    token_type: tokenType,
    refresh_token: refreshToken,
  } = verifiedCredentials;

  const { data: user } = await $.http.get('/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  await $.auth.set({
    accessToken,
    expiresIn,
    tokenType,
    userId: user.user_id,
    screenName: user.alias,
    email: user.email,
    refreshToken,
  });
};

export default verifyCredentials;
