import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAdminUser({ userId }) {
  const query = useQuery({
    queryKey: ['admin', 'users', userId],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/admin/users/${userId}`, {
        signal,
      });
      return data;
    },
    enabled: !!userId,
  });

  return query;
}
