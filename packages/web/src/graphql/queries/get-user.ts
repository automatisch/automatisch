import { gql } from '@apollo/client';

export const GET_USER = gql`
  query GetUser($id: String!) {
    getUser(id: $id) {
      id
      fullName
      email
      role {
        id
        key
        name
        isAdmin
      }
      createdAt
      updatedAt
    }
  }
`;
