import { useLazyQuery } from '@apollo/client';
import { AppAuthClient } from '@automatisch/types';
import * as React from 'react';

import { GET_APP_AUTH_CLIENT } from 'graphql/queries/get-app-auth-client.ee';

type QueryResponse = {
  getAppAuthClient: AppAuthClient;
};

export default function useAppAuthClient(id?: string) {
  const [getAppAuthClient, { data, loading }] =
    useLazyQuery<QueryResponse>(GET_APP_AUTH_CLIENT);
  const appAuthClient = data?.getAppAuthClient;

  React.useEffect(
    function fetchUponId() {
      if (!id) return;

      getAppAuthClient({ variables: { id } });
    },
    [id]
  );

  return {
    appAuthClient,
    loading,
  };
}
