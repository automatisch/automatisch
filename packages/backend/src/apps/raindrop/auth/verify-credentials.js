import { URLSearchParams } from 'url';
import getCurrentUser from '../common/get-current-user.js';

const verifyCredentials = async ($) => {
  // Get the redirect URI from the auth fields
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;

  const response = await $.http.post(
    'https://api.raindrop.io/v1/oauth/access_token',
    new URLSearchParams({
      client_id: $.auth.data.consumerKey,
      client_secret: $.auth.data.consumerSecret,
      code: $.auth.data.code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    }
  );

  const data = response.data;

  // Check if the response indicates an error
  if (!data.result) {
    throw new Error(data.errorMessage || 'OAuth verification failed');
  }

  $.auth.data.accessToken = data.access_token;

  const currentUser = await getCurrentUser($);

  await $.auth.set({
    consumerKey: $.auth.data.consumerKey,
    consumerSecret: $.auth.data.consumerSecret,
    accessToken: data.access_token,
    scope: data.scope,
    tokenType: data.token_type,
    userId: currentUser._id,
    screenName: currentUser.fullName || currentUser.email,
  });
};

export default verifyCredentials;
