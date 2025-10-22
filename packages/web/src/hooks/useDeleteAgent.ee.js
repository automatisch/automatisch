import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useDeleteAgent() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (agentId) => {
      const { data } = await api.delete(`/v1/agents/${agentId}`);

      return data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['agents'],
      });
    },
  });

  return mutation;
}
