import useCurrentUser from 'hooks/useCurrentUser';

export default function useIsCurrentUserAdmin() {
  const { data: currentUser, isLoading } = useCurrentUser();

  // ternary state so that we don't show false-positive feedback
  if (isLoading) return undefined;

  return currentUser?.data.role.isAdmin === true;
}
