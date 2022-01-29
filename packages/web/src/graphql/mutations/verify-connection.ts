import { gql } from '@apollo/client';

export const VERIFY_CONNECTION = gql`
  mutation VerifyConnection($id: String!) {
    verifyConnection(id: $id) {
      id
      verified
      data {
        screenName
      }
    }
  }
`;
