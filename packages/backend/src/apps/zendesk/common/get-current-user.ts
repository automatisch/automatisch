import { IGlobalVariable, IJSONObject } from '@automatisch/types';

const getCurrentUser = async ($: IGlobalVariable): Promise<IJSONObject> => {
  const response = await $.http.get('/api/v2/users/me');
  const currentUser = response.data.user;

  return currentUser;
};

export default getCurrentUser;
