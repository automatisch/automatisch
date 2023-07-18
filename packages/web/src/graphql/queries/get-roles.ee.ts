import { gql } from '@apollo/client';

export const GET_ROLES = gql`
  query GetRoles {
    getRoles {
      id
      key
      name
      description
      isAdmin
    }
  }
`;
