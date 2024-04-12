import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useRoles() {
  const query = useQuery({
    staleTime: 0,
    queryKey: ['admin', 'roles'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/v1/admin/roles', {
        signal,
      });

      return data;
    },
  });

  return query;
}
