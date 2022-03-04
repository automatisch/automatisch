import { gql } from '@apollo/client';

export const CREATE_CONNECTION = gql`
  mutation CreateConnection($key: AvailableAppsEnumType!, $data: JSONObject!) {
    createConnection(key: $key, formattedData: $data) {
      id
      key
      verified
      formattedData {
        screenName
      }
      app {
        key
      }
    }
  }
`;
