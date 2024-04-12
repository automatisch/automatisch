import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useAppConnections(appKey) {
  const query = useQuery({
    queryKey: ['apps', appKey, 'connections'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/apps/${appKey}/connections`, {
        signal,
      });

      return data;
    },
    enabled: !!appKey,
  });

  return query;
}
