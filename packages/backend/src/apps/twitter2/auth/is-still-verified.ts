import { IGlobalVariableForConnection } from '@automatisch/types';
import getCurrentUser from '../common/get-current-user';

const isStillVerified = async ($: IGlobalVariableForConnection) => {
  try {
    await getCurrentUser($);
    return true;
  } catch (error) {
    return false;
  }
};

export default isStillVerified;
