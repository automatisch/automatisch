import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useDeleteMcpTool(mcpServerId) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (mcpToolId) => {
      const { data } = await api.delete(
        `/v1/mcp-servers/${mcpServerId}/tools/${mcpToolId}`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['mcpServers', mcpServerId, 'tools'],
      });
    },
  });

  return mutation;
}
