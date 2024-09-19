import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useCreateFlow() {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/v1/flows');

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
