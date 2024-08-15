import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useApp(appKey) {
  const query = useQuery({
    queryKey: ['apps', appKey],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/apps/${appKey}`, {
        signal,
      });

      return data;
    },
    enabled: !!appKey,
  });

  return query;
}
