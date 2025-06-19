import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useDuplicateFlow(flowId) {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/v1/flows/${flowId}/duplicate`);

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
