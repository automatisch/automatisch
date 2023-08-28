import { gql } from '@apollo/client';

export const LIST_SAML_AUTH_PROVIDERS = gql`
  query ListSamlAuthProviders {
    listSamlAuthProviders {
      id
      name
      loginUrl
      issuer
    }
  }
`;
