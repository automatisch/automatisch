import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useCreateAgent() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (agentData) => {
      const { data } = await api.post('/v1/agents', agentData);

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
