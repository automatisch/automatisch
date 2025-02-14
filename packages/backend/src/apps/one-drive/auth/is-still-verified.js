import verifyCredentials from './verify-credentials.js';

const isStillVerified = async ($) => {
  await verifyCredentials($);
  return true;
};

export default isStillVerified;
