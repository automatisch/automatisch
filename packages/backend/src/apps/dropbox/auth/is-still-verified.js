import getCurrentAccount from '../common/get-current-account.js';

const isStillVerified = async ($) => {
  const account = await getCurrentAccount($);
  return !!account;
};

export default isStillVerified;
