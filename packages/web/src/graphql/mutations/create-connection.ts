import { gql } from '@apollo/client';

export const CREATE_CONNECTION = gql`
  mutation CreateConnection(
    $key: AvailableAppsEnumType!
    $formattedData: JSONObject!
  ) {
    createConnection(key: $key, formattedData: $formattedData) {
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
