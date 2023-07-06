import { gql } from '@apollo/client';

export const GET_SAML_AUTH_PROVIDERS = gql`
  query GetSamlAuthProviders {
    getSamlAuthProviders {
      id
      name
      issuer
    }
  }
`;
