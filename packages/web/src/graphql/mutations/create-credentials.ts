import { gql } from '@apollo/client';

export const CREATE_CREDENTIALS = gql`
  mutation CreateCredentials($displayName: String!, $key: String!, $data: twitterCredentialInput!) {
    createCredential(displayName: $displayName, key: $key, data: $data) {
      key
      displayName
      data {
        consumerKey
        consumerSecret
      }
    }
  }
`;
