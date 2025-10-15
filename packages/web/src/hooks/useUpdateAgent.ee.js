import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useUpdateAgent(agentId) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (agentData) => {
      const { data } = await api.patch(`/v1/agents/${agentId}`, agentData);

      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['agents', agentId],
      });
    },
  });

  return mutation;
}
