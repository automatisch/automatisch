import getCurrentUser from '../common/get-current-user.js';

const verifyCredentials = async ($) => {
  const user = await getCurrentUser($);

  await $.auth.set({
    screenName: user.name,
    apiKey: $.auth.data.apiKey,
  });
};

export default verifyCredentials;
