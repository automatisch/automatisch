import getCurrentUser from '../common/get-current-user.js';

const verifyCredentials = async ($) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const {data} = await $.http.post(`https://login.microsoftonline.com/${$.auth.data.tenantId}/oauth2/v2.0/token`, {
      client_id: $.auth.data.clientId,
      client_secret: $.auth.data.clientSecret,
      code: $.auth.data.code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  await $.auth.set({
    accessToken: data.access_token,
    tokenType: data.token_type,
  });

  const currentUser = await getCurrentUser($);

  const displayName = currentUser.displayName;
  const email = currentUser.mail;

  await $.auth.set({
    clientId: $.auth.data.clientId,
    clientSecret: $.auth.data.clientSecret,
    scope: $.auth.data.scope,
    idToken: data.id_token,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token,
    id: currentUser.id,
    screenName: `${displayName} - ${email}`,
  });
};

export default verifyCredentials;
