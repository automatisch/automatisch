import { IGlobalVariable } from '@automatisch/types';

const isStillVerified = async ($: IGlobalVariable) => {
  await $.http.get('/projects');
  return true;
};

export default isStillVerified;
