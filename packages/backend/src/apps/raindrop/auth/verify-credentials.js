import getCurrentUser from '../common/get-current-user.js';

const verifyCredentials = async ($) => {
  const response = await $.http.post(
    'https://raindrop.io/oauth/access_token',
    {
      client_id: $.auth.data.consumerKey,
      client_secret: $.auth.data.consumerSecret,
      code: $.auth.data.code,
      grant_type: 'authorization_code',
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    }
  );

  const data = response.data;

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
