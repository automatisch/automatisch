import getCurrentUser from '../common/get-current-user.js';

const verifyCredentials = async ($) => {
  const currentUser = await getCurrentUser($);
  const screenName = [currentUser.username, currentUser.email]
    .filter(Boolean)
    .join(' @ ');

  await $.auth.set({
    screenName,
  });
};

export default verifyCredentials;
