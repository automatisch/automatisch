import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useUpdateMcpServer(mcpServerId) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (mcpServerData) => {
      const { data } = await api.patch(
        `/v1/mcp-servers/${mcpServerId}`,
        mcpServerData,
      );

      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['mcpServers'],
      });
    },
  });

  return mutation;
}
