import { useQuery } from '@apollo/client';
import { LIST_SAML_AUTH_PROVIDERS } from 'graphql/queries/list-saml-auth-providers.ee';
export default function useSamlAuthProviders() {
  const { data, loading } = useQuery(LIST_SAML_AUTH_PROVIDERS);
  return {
    providers: data?.listSamlAuthProviders || [],
    loading,
  };
}
