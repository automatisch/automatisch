const verifyCredentials = async ($) => {
  if ($.auth.data.originalState !== $.auth.data.state) {
    throw new Error(`The 'state' parameter does not match.`);
  }
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const { data } = await $.http.post('https://app.ynab.com/oauth/token', {
    client_id: $.auth.data.clientId,
    client_secret: $.auth.data.clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
    code: $.auth.data.code,
  });

  await $.auth.set({
    accessToken: data.access_token,
    tokenType: data.token_type,
  });

  await $.auth.set({
    clientId: $.auth.data.clientId,
    clientSecret: $.auth.data.clientSecret,
    scope: data.scope,
    createdAt: data.created_at,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token,
    screenName: $.auth.data.screenName,
  });
};

export default verifyCredentials;
