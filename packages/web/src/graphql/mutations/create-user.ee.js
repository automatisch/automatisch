import { gql } from '@apollo/client';
export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput) {
    createUser(input: $input) {
      user {
        id
        email
        fullName
        role {
          id
        }
      }
      acceptInvitationUrl
    }
  }
`;
