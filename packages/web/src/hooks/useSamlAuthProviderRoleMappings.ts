import * as React from 'react';
import { useLazyQuery } from '@apollo/client';
import { TSamlAuthProviderRole } from '@automatisch/types';

import { GET_SAML_AUTH_PROVIDER_ROLE_MAPPINGS } from 'graphql/queries/get-saml-auth-provider-role-mappings';

type QueryResponse = {
  getSamlAuthProviderRoleMappings: TSamlAuthProviderRole[];
};

export default function useSamlAuthProviderRoleMappings(providerId?: string) {
  const [getSamlAuthProviderRoleMappings, { data, loading }] =
    useLazyQuery<QueryResponse>(GET_SAML_AUTH_PROVIDER_ROLE_MAPPINGS);

  React.useEffect(() => {
    if (providerId) {
      getSamlAuthProviderRoleMappings({
        variables: {
          id: providerId,
        },
      });
    }
  }, [providerId]);

  return {
    roleMappings: data?.getSamlAuthProviderRoleMappings || [],
    loading,
  };
}
