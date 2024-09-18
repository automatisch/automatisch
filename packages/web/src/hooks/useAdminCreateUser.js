import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAdminCreateUser() {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/v1/admin/users', payload);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'users'],
      });
    },
  });

  return query;
}
