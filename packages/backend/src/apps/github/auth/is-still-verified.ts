import { IGlobalVariable } from '@automatisch/types';
import getCurrentUser from '../common/get-current-user';

const isStillVerified = async ($: IGlobalVariable) => {
  try {
    const user = await getCurrentUser($);
    return !!user.id;
  } catch (error) {
    return false;
  }
};

export default isStillVerified;
