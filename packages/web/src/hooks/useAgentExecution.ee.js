import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useAgentExecution(agentId, executionId) {
  const query = useQuery({
    queryKey: ['agents', agentId, 'executions', executionId],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/agents/${agentId}/executions/${executionId}`, {
        signal,
      });

      return data;
    },
    enabled: !!(agentId && executionId),
  });

  return query;
}
