import { gql } from '@apollo/client';

export const GET_APP_AUTH_CLIENTS = gql`
  query GetAppAuthClients($appKey: String!, $active: Boolean) {
    getAppAuthClients(appKey: $appKey, active: $active) {
      id
      appConfigId
      name
      active
    }
  }
`;

