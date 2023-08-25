import { gql } from '@apollo/client';

export const UPSERT_SAML_AUTH_PROVIDER = gql`
  mutation UpsertSamlAuthProvider($input: UpsertSamlAuthProviderInput) {
    upsertSamlAuthProvider(input: $input) {
      id
    }
  }
`;
