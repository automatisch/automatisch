import { gql } from '@apollo/client';

export const CREATE_CONNECTION = gql`
  mutation CreateConnection($key: AvailableAppsEnumType!, $data: JSONObject!) {
    createConnection(key: $key, data: $data) {
      id
      key
      verified
      data {
        screenName
      }
      app {
        key
      }
    }
  }
`;
