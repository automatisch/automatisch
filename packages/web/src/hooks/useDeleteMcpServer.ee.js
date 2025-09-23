import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useDeleteMcpServer() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (mcpServerId) => {
      const { data } = await api.delete(`/v1/mcp-servers/${mcpServerId}`);

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
