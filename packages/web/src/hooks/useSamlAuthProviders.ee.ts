import { useQuery } from '@apollo/client';

import { TSamlAuthProvider } from '@automatisch/types';
import { LIST_SAML_AUTH_PROVIDERS } from 'graphql/queries/list-saml-auth-providers.ee';

type UseSamlAuthProvidersReturn = {
  providers: TSamlAuthProvider[];
  loading: boolean;
};

export default function useSamlAuthProviders(): UseSamlAuthProvidersReturn {
  const { data, loading } = useQuery(LIST_SAML_AUTH_PROVIDERS);

  return {
    providers: data?.listSamlAuthProviders || [],
    loading,
  };
}
