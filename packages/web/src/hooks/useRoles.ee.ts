import { useQuery } from '@apollo/client';
import { IRole } from '@automatisch/types';

import { GET_ROLES } from 'graphql/queries/get-roles.ee';

type QueryResponse = {
  getRoles: IRole[];
}

export default function useRoles() {
  const { data, loading } = useQuery<QueryResponse>(GET_ROLES, { context: { autoSnackbar: false } });

  return {
    roles: data?.getRoles || [],
    loading
  };
}
