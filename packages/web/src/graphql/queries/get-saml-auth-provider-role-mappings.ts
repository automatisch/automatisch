import { gql } from '@apollo/client';

export const GET_SAML_AUTH_PROVIDER_ROLE_MAPPINGS = gql`
  query GetSamlAuthProviderRoleMappings($id: String!) {
    getSamlAuthProviderRoleMappings(id: $id) {
      id
      samlAuthProviderId
      roleId
      remoteRoleName
    }
  }
`;
