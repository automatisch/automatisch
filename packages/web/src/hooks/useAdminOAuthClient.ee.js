import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useAdminOAuthClient(appKey, id) {
  const query = useQuery({
    queryKey: ['admin', 'apps', appKey, 'oauthClients', id],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(
        `/v1/admin/apps/${appKey}/oauth-clients/${id}`,
        {
          signal,
        },
      );

      return data;
    },
    enabled: !!appKey && !!id,
  });

  return query;
}
