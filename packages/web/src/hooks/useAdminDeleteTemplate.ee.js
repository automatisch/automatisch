import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useAdminDeleteTemplate(templateId) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`/v1/admin/templates/${templateId}`);

      return data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['admin', 'templates'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['templates'],
      });
    },
  });

  return mutation;
}
