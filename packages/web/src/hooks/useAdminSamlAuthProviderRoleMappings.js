import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useAdminSamlAuthProviderRoleMappings({
  adminSamlAuthProviderId,
}) {
  const query = useQuery({
    queryKey: ['adminSamlAuthProviderRoleMappings', adminSamlAuthProviderId],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(
        `/v1/admin/saml-auth-providers/${adminSamlAuthProviderId}/role-mappings`,
        {
          signal,
        },
      );

      return data;
    },
    enabled: !!adminSamlAuthProviderId,
  });

  return query;
}
