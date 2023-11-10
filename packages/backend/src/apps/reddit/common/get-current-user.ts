import { IGlobalVariable } from '@automatisch/types';

const getCurrentUser = async ($: IGlobalVariable) => {
  const { data: currentUser } = await $.http.get('/api/v1/me');
  return currentUser;
};

export default getCurrentUser;
