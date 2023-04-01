import { IGlobalVariable, IJSONObject } from '@automatisch/types';

const getCurrentAccount = async ($: IGlobalVariable): Promise<IJSONObject> => {
  const response = await $.http.post('/2/users/get_current_account', null);
  return response.data;
};

export default getCurrentAccount;
