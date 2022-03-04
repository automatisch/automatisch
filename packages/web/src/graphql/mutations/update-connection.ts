import { gql } from '@apollo/client';

export const UPDATE_CONNECTION = gql`
  mutation UpdateConnection($id: String!, $formattedData: JSONObject!) {
    updateConnection(id: $id, formattedData: $formattedData) {
      id
      key
      verified
      formattedData {
        screenName
      }
    }
  }
`;
