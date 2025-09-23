import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useMcpServer(mcpServerId) {
  const query = useQuery({
    queryKey: ['mcpServers', mcpServerId],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/mcp-servers/${mcpServerId}`, {
        signal,
      });

      return data;
    },
  });

  return query;
}
