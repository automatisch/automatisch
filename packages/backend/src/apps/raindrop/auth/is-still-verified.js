import getCurrentUser from '../common/get-current-user.js';

const isStillVerified = async ($) => {
  const user = await getCurrentUser($);
  return !!user._id;
};

export default isStillVerified;
