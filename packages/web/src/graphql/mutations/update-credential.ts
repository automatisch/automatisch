import { gql } from '@apollo/client';

export const UPDATE_CREDENTIAL = gql`
  mutation UpdateCredential($id: String!, $data: twitterCredentialInput!) {
    updateCredential(id: $id, data: $data) {
      id
      key
      verified
      data {
        consumerKey
        consumerSecret
      }
    }
  }
`;
