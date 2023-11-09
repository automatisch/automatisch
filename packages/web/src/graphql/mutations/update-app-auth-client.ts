import { gql } from '@apollo/client';

export const UPDATE_APP_AUTH_CLIENT = gql`
  mutation UpdateAppAuthClient($input: UpdateAppAuthClientInput) {
    updateAppAuthClient(input: $input) {
      id
      appConfigId
      name
      active
    }
  }
`;
