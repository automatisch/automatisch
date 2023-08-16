import { gql } from '@apollo/client';

export const GET_APP_AUTH_CLIENT = gql`
  query GetAppAuthClient($id: String!) {
    getAppAuthClient(id: $id) {
      id
      appConfigId
      name
      active
    }
  }
`;

