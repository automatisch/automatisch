import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useCreateMcpTool(mcpServerId) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post(
        `/v1/mcp-servers/${mcpServerId}/tools`,
        payload,
      );

      return data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['mcpServers', mcpServerId, 'tools'],
      });
    },
  });

  return mutation;
}
