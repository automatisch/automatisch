import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($input: LoginInput) {
    login(input: $input) {
      token
      user {
        id
        email
      }
    }
  }
`;
