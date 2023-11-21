import { IGlobalVariable } from '@automatisch/types';

const getCurrentUser = async ($: IGlobalVariable) => {
  const { data: currentUser } = await $.http.get('/');
  return currentUser;
};

export default getCurrentUser;
