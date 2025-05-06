import useCurrentUser from 'hooks/useCurrentUser';

export default function useIsCurrentUserAdmin() {
  const { data: currentUser } = useCurrentUser();

  return currentUser?.data.role.isAdmin === true;
}
