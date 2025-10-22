import { useMutation } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useTestAgent(agentId) {
  const mutation = useMutation({
    mutationFn: async (messages) => {
      const { data } = await api.post(`/v1/agents/${agentId}/test`, {
        messages,
      });
      return data;
    },
  });

  return mutation;
}
