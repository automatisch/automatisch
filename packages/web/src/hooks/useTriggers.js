import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useTriggers(appKey) {
  const query = useQuery({
    queryKey: ['apps', appKey, 'triggers'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/apps/${appKey}/triggers`, {
        signal,
      });

      return data;
    },
    enabled: !!appKey,
  });

  return query;
}
