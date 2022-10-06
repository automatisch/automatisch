import { IGlobalVariable } from '@automatisch/types';
import getCurrentUser from '../common/get-current-user';

const isStillVerified = async ($: IGlobalVariable) => {
  try {
    await getCurrentUser($);
    return true;
  } catch (error) {
    return false;
  }
};

export default isStillVerified;
