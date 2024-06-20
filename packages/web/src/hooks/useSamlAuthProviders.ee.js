import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useSamlAuthProviders() {
  const query = useQuery({
    queryKey: ['samlAuthProviders'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/v1/saml-auth-providers', {
        signal,
      });

      return data;
    },
  });

  return query;
}
