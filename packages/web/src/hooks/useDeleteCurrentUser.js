import { useMutation } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useDeleteCurrentUser(userId) {
  const query = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`/v1/users/${userId}`);

      return data;
    },
  });

  return query;
}
