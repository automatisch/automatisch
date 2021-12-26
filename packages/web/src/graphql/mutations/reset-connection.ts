import { gql } from '@apollo/client';

export const RESET_CONNECTION = gql`
  mutation ResetConnection($id: Int!) {
    resetConnection(id: $id) {
      id
    }
  }
`;
