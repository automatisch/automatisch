import { IGlobalVariable } from '@automatisch/types';

const verifyCredentials = async ($: IGlobalVariable) => {
  const { data } = await $.http.get('/');

  console.log('data:', data);
};

export default verifyCredentials;
