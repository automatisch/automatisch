import getCurrentUser from '../common/get-current-user.js';

const verifyCredentials = async ($) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const { data } = await $.http.post(`https://oauth2.googleapis.com/token`, {
    client_id: $.auth.data.clientId,
    client_secret: $.auth.data.clientSecret,
    code: $.auth.data.code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  });

  await $.auth.set({
    accessToken: data.access_token,
    tokenType: data.token_type,
  });

  const currentUser = await getCurrentUser($);

  const { displayName } = currentUser.names.find(
    (name) => name.metadata.primary
  );
  const { value: email } = currentUser.emailAddresses.find(
    (emailAddress) => emailAddress.metadata.primary
  );

  await $.auth.set({
    clientId: $.auth.data.clientId,
    clientSecret: $.auth.data.clientSecret,
    scope: $.auth.data.scope,
    idToken: data.id_token,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token,
    resourceName: currentUser.resourceName,
    screenName: `${displayName} - ${email}`,
    userId: email,
  });
};

export default verifyCredentials;
