import { gql } from '@apollo/client';

export const DELETE_CURRENT_USER = gql`
  mutation DeleteCurrentUser {
    deleteCurrentUser
  }
`;
