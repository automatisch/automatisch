import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useUser({ userId }) {
  const query = useQuery({
    queryKey: ['user', userId],
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
