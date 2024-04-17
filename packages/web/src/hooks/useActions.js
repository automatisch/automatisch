import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useActions(appKey) {
  const query = useQuery({
    queryKey: ['apps', appKey, 'actions'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/apps/${appKey}/actions`, {
        signal,
      });

      return data;
    },
    enabled: !!appKey,
  });

  return query;
}
