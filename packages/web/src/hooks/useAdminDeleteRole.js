import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAdminDeleteRole(roleId) {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`/v1/admin/roles/${roleId}`);

      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['admin', 'roles'],
      });
    },
  });

  return query;
}
