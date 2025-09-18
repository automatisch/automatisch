import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useRotateMcpServerToken(mcpServerId) {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/v1/mcp-servers/${mcpServerId}/rotate-token`);
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['mcpServers'] });
      await queryClient.invalidateQueries({ queryKey: ['mcpServers', mcpServerId] });
    },
  });

  return query;
}
