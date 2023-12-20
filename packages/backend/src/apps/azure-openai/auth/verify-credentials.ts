import { IGlobalVariable } from '@automatisch/types';

const verifyCredentials = async ($: IGlobalVariable) => {
  await $.http.get('/fine_tuning/jobs');
};

export default verifyCredentials;
