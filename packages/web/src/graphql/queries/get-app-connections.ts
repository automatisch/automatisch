import { gql } from '@apollo/client';

export const GET_APP_CONNECTIONS = gql`
  query GetAppConnections($key: String!) {
    getApp(key: $key) {
      key
      connections {
        id
        key
        verified
        data {
          screenName
        }
      }
    }
  }
`;
