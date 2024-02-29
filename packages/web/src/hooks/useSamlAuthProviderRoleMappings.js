import * as React from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_SAML_AUTH_PROVIDER_ROLE_MAPPINGS } from 'graphql/queries/get-saml-auth-provider-role-mappings';
export default function useSamlAuthProviderRoleMappings(providerId) {
  const [getSamlAuthProviderRoleMappings, { data, loading }] = useLazyQuery(
    GET_SAML_AUTH_PROVIDER_ROLE_MAPPINGS,
  );
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
