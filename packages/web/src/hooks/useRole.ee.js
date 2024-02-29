import * as React from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_ROLE } from 'graphql/queries/get-role.ee';
export default function useRole(roleId) {
  const [getRole, { data, loading }] = useLazyQuery(GET_ROLE);
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
