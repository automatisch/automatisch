import { useQuery } from '@apollo/client';
import { AppConfig } from '@automatisch/types';

import { GET_APP_CONFIG } from 'graphql/queries/get-app-config.ee';

type QueryResponse = {
  getAppConfig: AppConfig;
}

export default function useAppConfig(key: string) {
  const {
    data,
    loading
  } = useQuery<QueryResponse>(
    GET_APP_CONFIG,
    {
      variables: { key },
      context: { autoSnackbar: false }
    }
  );
  const appConfig = data?.getAppConfig;

  return {
    appConfig,
    loading,
  };
}
