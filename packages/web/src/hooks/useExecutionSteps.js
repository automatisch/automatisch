import { useInfiniteQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useExecutionSteps({ executionId }) {
  const query = useInfiniteQuery({
    queryKey: ['executions', executionId, 'executionSteps'],
    queryFn: async ({ pageParam = 1, signal }) => {
      const { data } = await api.get(
        `/v1/executions/${executionId}/execution-steps`,
        {
          params: {
            page: pageParam,
          },
          signal,
        },
      );

      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage?.meta?.currentPage < lastPage?.meta?.totalPages
        ? lastPage?.meta?.currentPage + 1
        : null,
  });

  return query;
}
