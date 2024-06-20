import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useExecutions({ page }, { refetchInterval } = {}) {
  const query = useQuery({
    queryKey: ['executions', { page }],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/executions`, {
        params: {
          page,
        },
        signal,
      });

      return data;
    },
    refetchInterval,
  });

  return query;
}
