import { gql } from '@apollo/client';

export const CREATE_AUTH_DATA = gql`
  mutation CreateAuthData($input: CreateAuthDataInput) {
    createAuthData(input: $input) {
      url
    }
  }
`;
