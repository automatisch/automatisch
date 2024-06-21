const verifyCredentials = async ($) => {
  if ($.auth.data.originalState !== $.auth.data.state) {
    throw new Error("The 'state' parameter does not match.");
  }
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const { data } = await $.http.post(
    'https://app.asana.com/-/oauth_token',
    {
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
    clientId: $.auth.data.clientId,
    clientSecret: $.auth.data.clientSecret,
    scope: $.auth.data.scope,
    id: data.data.id,
    gid: data.data.gid,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token,
    screenName: `${data.data.name} - ${data.data.email}`,
  });
};

export default verifyCredentials;
