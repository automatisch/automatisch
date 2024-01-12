import getCurrentUser from '../common/get-current-user.js';

const isStillVerified = async ($) => {
  await getCurrentUser($);
  return true;
};

export default isStillVerified;
