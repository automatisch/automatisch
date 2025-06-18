import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterUserInput) {
    registerUser(input: $input) {
      id
      email
      fullName
    }
  }
`;
