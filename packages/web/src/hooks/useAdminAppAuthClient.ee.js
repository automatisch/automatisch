import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useAdminAppAuthClient(id) {
  const query = useQuery({
    queryKey: ['admin', 'appAuthClients', id],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/admin/app-auth-clients/${id}`, {
        signal,
      });

      return data;
    },
    enabled: !!id,
  });

  return query;
}
