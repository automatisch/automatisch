import { IGlobalVariable, IJSONObject } from '@automatisch/types';

type Owner = {
  user: {
    id: string
  }
}

const getCurrentUser = async ($: IGlobalVariable): Promise<IJSONObject> => {
  const userId = ($.auth.data.owner as Owner).user.id;
  const response = await $.http.get(`/v1/users/${userId}`);

  const currentUser = response.data;
  return currentUser;
};

export default getCurrentUser;
