import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useCreateFlow() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ templateId }) => {
      const { data } = await api.post('/v1/flows', null, {
        params: { templateId },
      });

      return data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['flows'],
      });
    },
  });

  return mutation;
}
