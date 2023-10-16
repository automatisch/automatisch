import { IGlobalVariable } from '@automatisch/types';
import getCurrentUser from '../common/get-current-user';

const verifyCredentials = async ($: IGlobalVariable) => {
  const currentUser = await getCurrentUser($);
  const screenName = [currentUser.username, currentUser.email]
    .filter(Boolean)
    .join(' @ ');

  await $.auth.set({
    screenName,
  });
};

export default verifyCredentials;
