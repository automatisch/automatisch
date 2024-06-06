import getCurrentUser from '../common/get-current-user.js';

const verifyCredentials = async ($) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: $.auth.data.clientId,
    client_secret: $.auth.data.clientSecret,
    redirect_uri: redirectUri,
    code: $.auth.data.code,
  });

  const { data } = await $.http.post(
    'https://login.mailchimp.com/oauth2/token',
    params.toString()
  );

  await $.auth.set({
    accessToken: data.access_token,
    tokenType: data.token_type,
  });

  const currentUser = await getCurrentUser($);

  await $.auth.set({
    clientId: $.auth.data.clientId,
    clientSecret: $.auth.data.clientSecret,
    scope: $.auth.data.scope,
    idToken: data.id_token,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token,
    serverPrefix: currentUser.dc,
    screenName: currentUser.login.login_name,
  });
};

export default verifyCredentials;
