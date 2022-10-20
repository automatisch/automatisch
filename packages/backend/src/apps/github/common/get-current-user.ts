import { IGlobalVariable, IJSONObject } from '@automatisch/types';

const getCurrentUser = async ($: IGlobalVariable): Promise<IJSONObject> => {
  const response = await $.http.get('/user');

  const currentUser = response.data;
  return currentUser;
};

export default getCurrentUser;
