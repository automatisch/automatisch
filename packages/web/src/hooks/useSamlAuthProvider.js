import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useSamlAuthProvider({ samlAuthProviderId } = {}) {
  const query = useQuery({
    queryKey: ['samlAuthProviders', samlAuthProviderId],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(
        `/v1/admin/saml-auth-providers/${samlAuthProviderId}`,
        {
          signal,
        },
      );

      return data;
    },
    enabled: !!samlAuthProviderId,
  });

  return query;
}
