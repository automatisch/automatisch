import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useDeleteFlow(flowId) {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`/v1/flows/${flowId}`);

      return data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['flows'],
      });
    },
  });

  return query;
}
