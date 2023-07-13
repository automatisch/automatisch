import { IGlobalVariable, IJSONObject } from '@automatisch/types';

const getCurrentUser = async ($: IGlobalVariable): Promise<IJSONObject> => {
  const response = await $.http.get('/api/v4/users/me');
  const currentUser = response.data;
  return currentUser;
};

export default getCurrentUser;
