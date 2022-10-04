import { IGlobalVariableForConnection } from '@automatisch/types';
import generateRequest from './generate-request';

const getCurrentUser = async ($: IGlobalVariableForConnection) => {
  const response = await generateRequest($, {
    requestPath: '/2/users/me',
    method: 'GET',
  });

  const currentUser = response.data.data;
  return currentUser;
};

export default getCurrentUser;
