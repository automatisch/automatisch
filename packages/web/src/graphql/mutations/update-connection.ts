import { gql } from '@apollo/client';

export const UPDATE_CONNECTION = gql`
  mutation UpdateConnection($id: String!, $data: twitterCredentialInput!) {
    updateConnection(id: $id, data: $data) {
      id
      key
      verified
    }
  }
`;
