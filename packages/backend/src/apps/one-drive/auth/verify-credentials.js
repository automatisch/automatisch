const verifyCredentials = async ($) => {
  const oAuthRedirectUrl = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oAuthRedirectUrl.value;
  const dupa = $.auth.data
  console.log(dupa)
  const { data } = await $.http.post(
    `https://login.microsoftonline.com/common/oauth2/v2.0/token`,
    {
      client_id: $.auth.data.clientId,
      client_secret: $.auth.data.clientSecret,
      code: $.auth.data.code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }
  );

  await $.auth.set({
    accessToken: data.access_token,
    tokenType: data.token_type,
  });

  await $.auth.set({
    clientId: $.auth.data.clientId,
    clientSecret: $.auth.data.clientSecret,
    scope: $.auth.data.scope,
    idToken: data.id_token,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token,
  });
};

export default verifyCredentials;
