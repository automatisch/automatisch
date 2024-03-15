import userAbility from 'helpers/userAbility';
import useCurrentUser from 'hooks/useCurrentUser';

export default function useCurrentUserAbility() {
  const { data: currentUser } = useCurrentUser();

  return userAbility(currentUser?.data);
}
