import * as React from 'react';
import { LazyQueryHookOptions, useLazyQuery } from '@apollo/client';

import { GET_SHARED_CONNECTION_ROLE_IDS } from 'graphql/queries/get-shared-connection-role-ids';

type QueryResponse = {
  getSharedConnectionRoleIds: string[];
};

export default function useSharedConnectionRoleIds(
  connectionId: string,
  options?: LazyQueryHookOptions
) {
  const [getSharedConnectionRoleIds, { data, loading, error }] =
    useLazyQuery<QueryResponse>(GET_SHARED_CONNECTION_ROLE_IDS, options);

  React.useEffect(() => {
    if (connectionId) {
      getSharedConnectionRoleIds({
        variables: {
          id: connectionId,
        },
      });
    }
  }, [connectionId]);

  return {
    roleIds: data?.getSharedConnectionRoleIds || [],
    loading,
    error,
  };
}
