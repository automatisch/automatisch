import { gql } from '@apollo/client';

export const TEST_CONNECTION = gql`
  query TestConnection($id: Int!) {
    testConnection(id: $id) {
      id
      verified
    }
  }
`;
