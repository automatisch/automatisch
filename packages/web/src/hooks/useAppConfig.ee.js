import { useQuery } from '@apollo/client';
import { GET_APP_CONFIG } from 'graphql/queries/get-app-config.ee';
export default function useAppConfig(key) {
  const { data, loading } = useQuery(GET_APP_CONFIG, {
    variables: { key },
    context: { autoSnackbar: false },
  });
  const appConfig = data?.getAppConfig;
  return {
    appConfig,
    loading,
  };
}
