import { gql } from '@apollo/client';

export const UPDATE_CURRENT_USER = gql`
  mutation UpdateCurrentUser($input: UpdateCurrentUserInput) {
    updateCurrentUser(input: $input) {
      id
      fullName
      email
    }
  }
`;
