import { useMutation } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useUpdateCurrentUserPassword(userId) {
  const query = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.patch(`/v1/users/${userId}/password`, payload);

      return data;
    },
  });

  return query;
}
