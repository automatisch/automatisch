import getCurrentUser from '../common/get-current-user.js';

const verifyCredentials = async ($) => {
  if ($.auth.data.originalState !== $.auth.data.state) {
    throw new Error("The 'state' parameter does not match.");
  }
  if ($.auth.data.originalCodeChallenge !== $.auth.data.code_challenge) {
    throw new Error("The 'code challenge' parameter does not match.");
  }
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const basicAuthToken = Buffer.from(
    $.auth.data.clientId + ':' + $.auth.data.clientSecret
  ).toString('base64');

  const { data } = await $.http.post(
    'https://airtable.com/oauth2/v1/token',
    {
      code: $.auth.data.code,
      client_id: $.auth.data.clientId,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
      code_verifier: $.auth.data.codeVerifier,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basicAuthToken}`,
      },
      additionalProperties: {
        skipAddingAuthHeader: true,
      },
    }
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
    expiresIn: data.expires_in,
    refreshExpiresIn: data.refresh_expires_in,
    refreshToken: data.refresh_token,
    screenName: currentUser.email,
  });
};

export default verifyCredentials;
