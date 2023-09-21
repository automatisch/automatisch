import { IGlobalVariable } from '@automatisch/types';
import getCurrentUser from '../common/get-current-user';

const isStillVerified = async ($: IGlobalVariable) => {
  const currentUser = await getCurrentUser($);
  return !!currentUser;
};

export default isStillVerified;
