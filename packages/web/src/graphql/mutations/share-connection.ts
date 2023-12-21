import { gql } from '@apollo/client';

export const SHARE_CONNECTION = gql`
  mutation ShareConnection($input: ShareConnectionInput) {
    shareConnection(input: $input) {
      id
    }
  }
`;
