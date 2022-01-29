import { gql } from '@apollo/client';

export const DELETE_CONNECTION = gql`
  mutation DeleteConnection($id: String!) {
    deleteConnection(id: $id)
  }
`;
