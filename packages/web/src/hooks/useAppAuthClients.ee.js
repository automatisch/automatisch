import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { GET_APP_AUTH_CLIENTS } from 'graphql/queries/get-app-auth-clients.ee';
export default function useAppAuthClient({ appKey, active }) {
  const [getAppAuthClients, { data, loading }] = useLazyQuery(
    GET_APP_AUTH_CLIENTS,
    {
      context: { autoSnackbar: false },
    },
  );
  const appAuthClients = data?.getAppAuthClients;
  React.useEffect(
    function fetchUponAppKey() {
      if (!appKey) return;
      getAppAuthClients({
        variables: { appKey, ...(typeof active === 'boolean' && { active }) },
      });
    },
    [appKey],
  );
  return {
    appAuthClients,
    loading,
  };
}
