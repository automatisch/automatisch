import { gql } from '@apollo/client';

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      fullName
      email
      createdAt
      updatedAt
    }
  }
`;
