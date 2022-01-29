import { gql } from '@apollo/client';

export const RESET_CONNECTION = gql`
  mutation ResetConnection($id: String!) {
    resetConnection(id: $id) {
      id
    }
  }
`;
