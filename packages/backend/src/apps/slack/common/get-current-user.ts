import { IGlobalVariable, IJSONObject } from '@automatisch/types';

const getCurrentUser = async ($: IGlobalVariable): Promise<IJSONObject> => {
  const params = {
    user: $.auth.data.userId as string,
  };
  const response = await $.http.get('/users.info', { params });
  const currentUser = response.data.user;

  return currentUser;
};

export default getCurrentUser;
