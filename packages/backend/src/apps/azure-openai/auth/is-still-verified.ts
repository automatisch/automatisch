import { IGlobalVariable } from '@automatisch/types';

const isStillVerified = async ($: IGlobalVariable) => {
  await $.http.get('/fine_tuning/jobs');
  return true;
};

export default isStillVerified;
