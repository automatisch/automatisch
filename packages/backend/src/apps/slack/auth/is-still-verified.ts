import { IGlobalVariable } from '@automatisch/types';
import getCurrentUser from '../common/get-current-user';

const isStillVerified = async ($: IGlobalVariable) => {
  const user = await getCurrentUser($);
  return !!user.id;
};

export default isStillVerified;
