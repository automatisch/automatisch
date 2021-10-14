import { gql } from '@apollo/client';

export const CREATE_CREDENTIAL = gql`
  mutation CreateCredential($key: String!, $data: twitterCredentialInput!) {
    createCredential(key: $key, data: $data) {
      key
      id
      data {
        consumerKey
        consumerSecret
      }
    }
  }
`;
