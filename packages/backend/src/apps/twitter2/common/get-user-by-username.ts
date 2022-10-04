import { IGlobalVariableForConnection, IJSONObject } from '@automatisch/types';
import generateRequest from './generate-request';

const getUserByUsername = async (
  $: IGlobalVariableForConnection,
  username: string
) => {
  const response = await generateRequest($, {
    requestPath: `/2/users/by/username/${username}`,
    method: 'GET',
  });

  if (response.data.errors) {
    const errorMessages = response.data.errors
      .map((error: IJSONObject) => error.detail)
      .join(' ');

    throw new Error(`Error occured while fetching user data: ${errorMessages}`);
  }

  const user = response.data.data;
  return user;
};

export default getUserByUsername;
