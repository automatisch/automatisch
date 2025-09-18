import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useMcpServers() {
  const query = useQuery({
    queryKey: ['mcpServers'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/v1/mcp-servers', {
        signal,
      });

      return data;
    },
  });

  return query;
}
