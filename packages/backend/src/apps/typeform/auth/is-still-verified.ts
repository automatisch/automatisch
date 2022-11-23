import { IGlobalVariable } from '@automatisch/types';

const isStillVerified = async ($: IGlobalVariable) => {
  await $.http.get('/me');

  return true;
};

export default isStillVerified;
