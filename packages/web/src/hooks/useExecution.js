import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useExecution({ executionId }) {
  const query = useQuery({
    queryKey: ['executions', executionId],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/executions/${executionId}`, {
        signal,
      });

      return data;
    },
  });

  return query;
}
