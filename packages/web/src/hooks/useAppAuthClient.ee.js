import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { GET_APP_AUTH_CLIENT } from 'graphql/queries/get-app-auth-client.ee';
export default function useAppAuthClient(id) {
  const [getAppAuthClient, { data, loading }] =
    useLazyQuery(GET_APP_AUTH_CLIENT);
  const appAuthClient = data?.getAppAuthClient;
  React.useEffect(
    function fetchUponId() {
      if (!id) return;
      getAppAuthClient({ variables: { id } });
    },
    [id],
  );
  return {
    appAuthClient,
    loading,
  };
}
