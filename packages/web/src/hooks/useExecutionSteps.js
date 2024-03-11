import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useExecutionSteps(executionId, page) {
  const query = useQuery({
    queryKey: ['executionSteps', executionId, page],
    queryFn: async ({ payload, signal }) => {
      const { data } = await api.get(
        `/v1/executions/${executionId}/execution-steps`,
        {
          params: {
            page: page,
          },
          signal,
        },
      );

      return data;
    },
  });

  return query;
}
