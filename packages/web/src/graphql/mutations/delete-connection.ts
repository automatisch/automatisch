import { gql } from '@apollo/client';

export const DELETE_CONNECTION = gql`
  mutation DeleteConnection($id: Int!) {
    deleteConnection(id: $id)
  }
`;
