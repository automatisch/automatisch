import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useAdminDeleteApiToken(apiTokenid) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`/v1/admin/api-tokens/${apiTokenid}`);

      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['admin', 'apiTokens'],
      });
    },
  });

  return mutation;
}
