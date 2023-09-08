import { IGlobalVariable } from '@automatisch/types';
import getAccessTokenInfo from '../common/get-access-token-info';

const isStillVerified = async ($: IGlobalVariable) => {
  await getAccessTokenInfo($);

  return true;
};

export default isStillVerified;
