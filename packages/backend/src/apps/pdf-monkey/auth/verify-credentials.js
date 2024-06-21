import getCurrentUser from '../common/get-current-user.js';

const verifyCredentials = async ($) => {
  const currentUser = await getCurrentUser($);
  const screenName = [currentUser.desired_name, currentUser.email]
    .filter(Boolean)
    .join(' @ ');

  await $.auth.set({
    screenName,
    apiKey: $.auth.data.apiKey,
  });
};

export default verifyCredentials;
