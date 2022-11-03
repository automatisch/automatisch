import { IGlobalVariable, IJSONObject } from '@automatisch/types';

const getCurrentUser = async ($: IGlobalVariable): Promise<IJSONObject> => {
  const response = await $.http.get('/services/data/v55.0/chatter/users/me');
  const currentUser = response.data;

  return currentUser;
};

export default getCurrentUser;
