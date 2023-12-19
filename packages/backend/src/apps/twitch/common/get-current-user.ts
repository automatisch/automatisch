import { IGlobalVariable } from '@automatisch/types';

const getCurrentUser = async ($: IGlobalVariable) => {
  const { data: currentUser } = await $.http.get('/helix/users');
  return currentUser.data[0];
};

export default getCurrentUser;
