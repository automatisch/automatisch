import * as React from 'react';
import { useLazyQuery } from '@apollo/client';
import { IRole } from '@automatisch/types';

import { GET_ROLE } from 'graphql/queries/get-role.ee';

type QueryResponse = {
  getRole: IRole;
};

export default function useRole(roleId?: string) {
  const [getRole, { data, loading }] = useLazyQuery<QueryResponse>(GET_ROLE);

  React.useEffect(() => {
    if (roleId) {
      getRole({
        variables: {
          id: roleId,
        },
      });
    }
  }, [roleId]);

  return {
    role: data?.getRole,
    loading,
  };
}
