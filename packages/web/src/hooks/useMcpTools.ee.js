import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useMcpTools(mcpServerId) {
  const query = useQuery({
    queryKey: ['mcpServers', mcpServerId, 'tools'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/mcp-servers/${mcpServerId}/tools`, {
        signal,
      });

      return data;
    },
    enabled: !!mcpServerId,
  });

  return query;
}
