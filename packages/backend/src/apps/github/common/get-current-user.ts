import { IGlobalVariable, IJSONObject } from '@automatisch/types';
import generateRequest from './generate-request';

const getCurrentUser = async ($: IGlobalVariable): Promise<IJSONObject> => {
  const response = await generateRequest($, {
    requestPath: '/user',
    method: 'GET',
  });

  const currentUser = response.data;
  return currentUser;
};

export default getCurrentUser;
