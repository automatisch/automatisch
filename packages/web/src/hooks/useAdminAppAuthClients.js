import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAdminAppAuthClient(appKey) {
  const query = useQuery({
    queryKey: ['admin', 'apps', appKey, 'auth-clients'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/admin/apps/${appKey}/auth-clients`, {
        signal,
      });
      return data;
    },
    enabled: !!appKey,
  });

  return query;
}
