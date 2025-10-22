import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useDeleteAgentTool(agentId) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (toolId) => {
      await api.delete(`/v1/agents/${agentId}/tools/${toolId}`);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['agents', agentId, 'tools'],
      });
    },
  });

  return mutation;
}
