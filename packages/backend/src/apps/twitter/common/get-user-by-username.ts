import { IGlobalVariable, IJSONObject } from '@automatisch/types';

const getUserByUsername = async ($: IGlobalVariable, username: string) => {
  const response = await $.http.get(`/2/users/by/username/${username}`);

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
