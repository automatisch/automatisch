import { useLazyQuery } from '@apollo/client';
import { AppAuthClient } from '@automatisch/types';
import * as React from 'react';

import { GET_APP_AUTH_CLIENTS } from 'graphql/queries/get-app-auth-clients.ee';

type QueryResponse = {
  getAppAuthClients: AppAuthClient[];
}

export default function useAppAuthClient(appKey: string) {
  const [
    getAppAuthClients,
    {
      data,
      loading
    }
  ] = useLazyQuery<QueryResponse>(GET_APP_AUTH_CLIENTS, {
    context: { autoSnackbar: false },
  });
  const appAuthClients = data?.getAppAuthClients;

  React.useEffect(function fetchUponAppKey() {
    if (!appKey) return;

    getAppAuthClients({ variables: { appKey, active: true } });
  }, [appKey]);

  return {
    appAuthClients,
    loading,
  };
}
