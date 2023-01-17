import { IGlobalVariable } from '@automatisch/types';

const isStillVerified = async ($: IGlobalVariable) => {
  await $.http.get('/v1/models');
  return true;
};

export default isStillVerified;
