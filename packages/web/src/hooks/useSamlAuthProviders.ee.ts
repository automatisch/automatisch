import { useQuery } from '@apollo/client';

import { TSamlAuthProvider } from '@automatisch/types';
import { GET_SAML_AUTH_PROVIDERS } from 'graphql/queries/get-saml-auth-providers.ee';

type UseSamlAuthProvidersReturn = {
  providers: TSamlAuthProvider[];
  loading: boolean;
};

export default function useSamlAuthProviders(): UseSamlAuthProvidersReturn {
  const { data, loading } = useQuery(GET_SAML_AUTH_PROVIDERS);

  return {
    providers: data?.getSamlAuthProviders || [],
    loading
  };
}
