import { gql } from '@apollo/client';

export const CREATE_APP_AUTH_CLIENT = gql`
  mutation CreateAppAuthClient($input: CreateAppAuthClientInput) {
    createAppAuthClient(input: $input) {
      id
      appConfigId
      name
      active
    }
  }
`;
