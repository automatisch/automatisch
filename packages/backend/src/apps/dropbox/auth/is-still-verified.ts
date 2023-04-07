import { IGlobalVariable } from '@automatisch/types';
import getCurrentAccount from '../common/get-current-account';

const isStillVerified = async ($: IGlobalVariable) => {
  const account = await getCurrentAccount($);
  return !!account;
};

export default isStillVerified;
