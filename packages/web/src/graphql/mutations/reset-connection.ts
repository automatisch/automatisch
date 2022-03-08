import { gql } from '@apollo/client';

export const RESET_CONNECTION = gql`
  mutation ResetConnection($input: ResetConnectionInput) {
    resetConnection(input: $input) {
      id
    }
  }
`;
