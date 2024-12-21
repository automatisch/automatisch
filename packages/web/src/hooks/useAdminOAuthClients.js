import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAdminOAuthClients(appKey) {
  const query = useQuery({
    queryKey: ['admin', 'apps', appKey, 'oauthClients'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/admin/apps/${appKey}/oauth-clients`, {
        signal,
      });
      return data;
    },
    enabled: !!appKey,
  });

  return query;
}
