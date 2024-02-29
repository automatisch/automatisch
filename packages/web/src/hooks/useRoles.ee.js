import { useQuery } from '@apollo/client';
import { GET_ROLES } from 'graphql/queries/get-roles.ee';
export default function useRoles() {
  const { data, loading } = useQuery(GET_ROLES, {
    context: { autoSnackbar: false },
  });
  return {
    roles: data?.getRoles || [],
    loading,
  };
}
