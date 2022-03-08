import { gql } from '@apollo/client';

export const DELETE_CONNECTION = gql`
  mutation DeleteConnection($input: DeleteConnectionInput) {
    deleteConnection(input: $input)
  }
`;
