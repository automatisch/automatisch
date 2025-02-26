import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAdminTemplates() {
  const query = useQuery({
    queryKey: ['admin', 'templates'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/v1/admin/templates', {
        signal,
      });

      return data;
    },
  });

  return query;
}
