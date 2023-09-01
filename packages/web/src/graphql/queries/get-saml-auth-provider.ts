import { gql } from '@apollo/client';

export const GET_SAML_AUTH_PROVIDER = gql`
  query GetSamlAuthProvider {
    getSamlAuthProvider {
      id
      name
      certificate
      signatureAlgorithm
      issuer
      entryPoint
      firstnameAttributeName
      surnameAttributeName
      emailAttributeName
      roleAttributeName
      active
      defaultRoleId
    }
  }
`;
