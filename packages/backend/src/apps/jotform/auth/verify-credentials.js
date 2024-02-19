import getCurrentUser from '../common/get-current-user.js';

const verifyCredentials = async ($) => {
  const user = await getCurrentUser($);

  const screenName = [user.username, user.email].filter(Boolean).join(' @ ');

  await $.auth.set({
    screenName,
    apiKey: $.auth.data.apiKey,
  });
};

export default verifyCredentials;
