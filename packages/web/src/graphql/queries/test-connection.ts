import { gql } from '@apollo/client';

export const TEST_CONNECTION = gql`
  query TestConnection($id: String!) {
    testConnection(id: $id) {
      id
      verified
    }
  }
`;
