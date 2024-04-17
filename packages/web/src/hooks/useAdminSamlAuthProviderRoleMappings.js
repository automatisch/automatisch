import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useAdminSamlAuthProviderRoleMappings({
  adminSamlAuthProviderId: providerId,
}) {
  const query = useQuery({
    queryKey: ['admin', 'samlAuthProviders', providerId, 'roleMappings'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(
        `/v1/admin/saml-auth-providers/${providerId}/role-mappings`,
        {
          signal,
        },
      );

      return data;
    },
    enabled: !!providerId,
  });

  return query;
}
