import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useDeleteFlow() {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: async (flowId) => {
      const { data } = await api.delete(`/v1/flows/${flowId}`);

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['flows'],
      });
    },
  });

  return query;
}
