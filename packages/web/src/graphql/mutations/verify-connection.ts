import { gql } from '@apollo/client';

export const VERIFY_CONNECTION = gql`
  mutation VerifyConnection($id: Int!) {
    verifyConnection(id: $id) {
      id
      verified
      data {
        screenName
      }
    }
  }
`;
