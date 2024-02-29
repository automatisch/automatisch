import { useQuery } from '@apollo/client';
import { GET_SAML_AUTH_PROVIDER } from 'graphql/queries/get-saml-auth-provider';
export default function useSamlAuthProvider() {
  const { data, loading, refetch } = useQuery(GET_SAML_AUTH_PROVIDER, {
    context: { autoSnackbar: false },
  });
  return {
    provider: data?.getSamlAuthProvider,
    loading,
    refetch,
  };
}
