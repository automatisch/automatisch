import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAdminApiTokens() {
  const query = useQuery({
    queryKey: ['admin', 'apiTokens'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/admin/api-tokens`, {
        signal,
      });

      return data;
    },
  });

  return query;
}
