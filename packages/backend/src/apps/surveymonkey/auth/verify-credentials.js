import getCurrentUser from '../common/get-current-user.js';

const verifyCredentials = async ($) => {
  if ($.auth.data.originalState !== $.auth.data.state) {
    throw new Error("The 'state' parameter does not match.");
  }

  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const { data } = await $.http.post(
    'https://api.surveymonkey.com/oauth/token',
    {
      client_secret: $.auth.data.clientSecret,
      code: $.auth.data.code,
      redirect_uri: redirectUri,
      client_id: $.auth.data.clientId,
      grant_type: 'authorization_code',
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
    accessUrl: data.access_url,
    expiresIn: data.expires_in,
  });

  const currentUser = await getCurrentUser($);

  const screenName = [currentUser.username, currentUser.email]
    .filter(Boolean)
    .join(' @ ');

  await $.auth.set({
    clientId: $.auth.data.clientId,
    clientSecret: $.auth.data.clientSecret,
    screenName,
  });
};

export default verifyCredentials;
