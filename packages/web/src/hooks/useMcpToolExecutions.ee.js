import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useMcpToolExecutions(mcpServerId, page = 1) {
  const query = useQuery({
    queryKey: ['mcpServers', mcpServerId, 'executions', page],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(
        `/v1/mcp-servers/${mcpServerId}/executions`,
        {
          signal,
          params: { page },
        },
      );

      return data;
    },
    enabled: !!mcpServerId,
  });

  return query;
}
