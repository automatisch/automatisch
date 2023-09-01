import { gql } from '@apollo/client';

export const UPSERT_SAML_AUTH_PROVIDERS_ROLE_MAPPINGS = gql`
  mutation UpsertSamlAuthProvidersRoleMappings(
    $input: UpsertSamlAuthProvidersRoleMappingsInput
  ) {
    upsertSamlAuthProvidersRoleMappings(input: $input) {
      id
      samlAuthProviderId
      roleId
      remoteRoleName
    }
  }
`;
