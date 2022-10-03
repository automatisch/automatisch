import getCurrentUser from '../common/get-current-user';

const isStillVerified = async ($: any) => {
  try {
    await getCurrentUser($);
    return true;
  } catch (error) {
    return false;
  }
};

export default isStillVerified;
