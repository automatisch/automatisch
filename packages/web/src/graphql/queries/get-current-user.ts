import { gql } from '@apollo/client';

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      fullName
      email
      role {
        isAdmin
      }
      permissions {
        action
        subject
        conditions
      }
    }
  }
`;
