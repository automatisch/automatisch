import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useAdminSamlAuthProviders() {
  const query = useQuery({
    queryKey: ['admin', 'samlAuthProviders'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/v1/admin/saml-auth-providers', {
        signal,
      });

      return data;
    },
  });

  return query;
}
