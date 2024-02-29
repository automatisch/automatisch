import { useQuery } from '@apollo/client';
import { GET_APPS } from 'graphql/queries/get-apps';
export default function useApps(variables) {
  const { data, loading } = useQuery(GET_APPS, {
    variables,
  });
  const apps = data?.getApps;
  return {
    apps,
    loading,
  };
}
