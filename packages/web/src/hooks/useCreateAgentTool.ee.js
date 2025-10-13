import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useCreateAgentTool(agentId) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post(`/v1/agents/${agentId}/tools`, payload);

      return data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['agents', agentId, 'tools'],
      });
    },
  });

  return mutation;
}
