import { IGlobalVariable } from '@automatisch/types';

const getCurrentUser = async ($: IGlobalVariable) => {
  const { data: currentUser } = await $.http.get('/connections');
  return currentUser[0];
};

export default getCurrentUser;
