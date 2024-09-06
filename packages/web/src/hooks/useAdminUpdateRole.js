import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAdminUpdateRole(roleId) {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.patch(`/v1/admin/roles/${roleId}`, payload);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'roles'],
      });
    },
  });

  return query;
}
