import { IGlobalVariable } from '@automatisch/types';
import verifyCredentials from './verify-credentials';

const isStillVerified = async ($: IGlobalVariable) => {
  try {
    await verifyCredentials($);
    return true;
  } catch (error) {
    return false;
  }
};

export default isStillVerified;
