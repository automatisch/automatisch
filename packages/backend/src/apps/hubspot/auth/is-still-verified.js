import getAccessTokenInfo from '../common/get-access-token-info.js';

const isStillVerified = async ($) => {
  await getAccessTokenInfo($);

  return true;
};

export default isStillVerified;
