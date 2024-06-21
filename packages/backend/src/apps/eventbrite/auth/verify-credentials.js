import getCurrentUser from '../common/get-current-user.js';

const verifyCredentials = async ($) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const { data } = await $.http.post(
    'https://www.eventbrite.com/oauth/token',
    {
      grant_type: 'authorization_code',
      client_id: $.auth.data.clientId,
      client_secret: $.auth.data.clientSecret,
      code: $.auth.data.code,
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

  const screenName = [currentUser.name, currentUser.emails[0].email]
    .filter(Boolean)
    .join(' @ ');

  await $.auth.set({
    clientId: $.auth.data.clientId,
    clientSecret: $.auth.data.clientSecret,
    screenName,
  });
};

export default verifyCredentials;
