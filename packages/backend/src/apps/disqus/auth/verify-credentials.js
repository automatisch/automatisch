import { URLSearchParams } from 'url';

const verifyCredentials = async ($) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: $.auth.data.apiKey,
    client_secret: $.auth.data.apiSecret,
    redirect_uri: redirectUri,
    code: $.auth.data.code,
  });

  const { data } = await $.http.post(
    `https://disqus.com/api/oauth/2.0/access_token/`,
    params.toString()
  );

  await $.auth.set({
    accessToken: data.access_token,
    tokenType: data.token_type,
    apiKey: $.auth.data.apiKey,
    apiSecret: $.auth.data.apiSecret,
    scope: $.auth.data.scope,
    userId: data.user_id,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token,
    screenName: data.username,
  });
};

export default verifyCredentials;
