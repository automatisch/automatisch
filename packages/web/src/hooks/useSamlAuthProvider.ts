import { useQuery } from '@apollo/client';

import { TSamlAuthProvider } from '@automatisch/types';
import { GET_SAML_AUTH_PROVIDER } from 'graphql/queries/get-saml-auth-provider';

type UseSamlAuthProviderReturn = {
  provider: TSamlAuthProvider;
  loading: boolean;
};

export default function useSamlAuthProvider(): UseSamlAuthProviderReturn {
  const { data, loading } = useQuery(GET_SAML_AUTH_PROVIDER, {
    context: { autoSnackbar: false },
  });

  return {
    provider: data?.getSamlAuthProvider,
    loading,
  };
}
