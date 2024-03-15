import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useUsers(page) {
  
  const query = useQuery({
    queryKey: ['users', page],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/admin/users`, {
        signal,
        params: { page },
      });
      return data;
    },
  });

  return query;
}
