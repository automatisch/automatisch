import { useQuery } from '@apollo/client';
import { IJSONObject } from '@automatisch/types';

import { GET_CONFIG } from 'graphql/queries/get-config.ee';

type QueryResponse = {
  getConfig: IJSONObject;
}

export default function useConfig(keys?: string[]) {
  const { data, loading } = useQuery<QueryResponse>(GET_CONFIG, { variables: { keys } });

  return {
    config: data?.getConfig,
    loading,
  };
}
