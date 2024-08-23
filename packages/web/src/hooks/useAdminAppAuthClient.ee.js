import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useAdminAppAuthClient(appKey, id) {
  const query = useQuery({
    queryKey: ['admin', 'apps', appKey, 'authClients', id],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/admin/apps/${appKey}/auth-clients/${id}`, {
        signal,
      });

      return data;
    },
    enabled: !!appKey && !!id,
  });

  return query;
}
