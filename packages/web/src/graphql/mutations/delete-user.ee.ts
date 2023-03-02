import { gql } from '@apollo/client';

export const DELETE_USER = gql`
  mutation DeleteUser($input: DeleteUserInput) {
    deleteUser(input: $input)
  }
`;
