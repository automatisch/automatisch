import { gql } from '@apollo/client';

export const GET_ROLE = gql`
  query GetRole($id: String!) {
    getRole(id: $id) {
      id
      key
      name
      description
      isAdmin
      permissions {
        id
        action
        subject
        conditions
      }
    }
  }
`;
