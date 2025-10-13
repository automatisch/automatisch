import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useAgentExecutions(
  agentId,
  { page, status, refetchInterval } = {},
) {
  const query = useQuery({
    queryKey: ['agents', agentId, 'executions', { page, status }],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/agents/${agentId}/executions`, {
        params: {
          page,
          status,
        },
        signal,
      });

      return data;
    },
    enabled: !!agentId,
    refetchInterval,
  });

  return query;
}
