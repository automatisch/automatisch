import getCurrentUser from '../common/get-current-user.js';

const isStillVerified = async ($) => {
  const currentUser = await getCurrentUser($);
  return !!currentUser.id;
};

export default isStillVerified;
