import getCurrentUser from '../common/get-current-user.js';

const verifyCredentials = async ($) => {
  try {
    const user = await getCurrentUser($);

    await $.auth.set({
      screenName: user.customDisplayName + ' (' + user.providerDisplayName + ')',
    });
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Invalid credentials');
    }
    throw error;
  }
};

export default verifyCredentials;
