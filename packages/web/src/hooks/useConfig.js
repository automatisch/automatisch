import { useQuery } from '@apollo/client';
import { GET_CONFIG } from 'graphql/queries/get-config.ee';
export default function useConfig(keys) {
  const { data, loading } = useQuery(GET_CONFIG, {
    variables: { keys },
  });
  return {
    config: data?.getConfig,
    loading,
  };
}
