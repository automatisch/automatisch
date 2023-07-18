import userAbility from 'helpers/userAbility';
import useCurrentUser from 'hooks/useCurrentUser';

export default function useCurrentUserAbility() {
  const currentUser = useCurrentUser();

  return userAbility(currentUser);
}
