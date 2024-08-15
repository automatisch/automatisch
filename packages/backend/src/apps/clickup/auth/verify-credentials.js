import getCurrentUser from '../common/get-current-user.js';

const verifyCredentials = async ($) => {
  if ($.auth.data.originalState !== $.auth.data.state) {
    throw new Error(`The 'state' parameter does not match.`);
  }

  const { data } = await $.http.post('/v2/oauth/token', {
    client_id: $.auth.data.clientId,
    client_secret: $.auth.data.clientSecret,
    code: $.auth.data.code,
  });

  await $.auth.set({
    accessToken: data.access_token,
    tokenType: data.token_type,
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
