import { gql } from '@apollo/client';

export const GET_APP_CONFIG = gql`
  query GetAppConfig($key: String!) {
    getAppConfig(key: $key) {
      id
      key
      allowCustomConnection
      canConnect
      canCustomConnect
      shared
      disabled
    }
  }
`;

