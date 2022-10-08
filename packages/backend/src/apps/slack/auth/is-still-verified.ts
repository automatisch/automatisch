import verifyCredentials from './verify-credentials';

const isStillVerified = async ($: any) => {
  try {
    await verifyCredentials($);
    return true;
  } catch (error) {
    return false;
  }
};

export default isStillVerified;
