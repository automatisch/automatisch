import { gql } from '@apollo/client';

export const UPDATE_CONNECTION = gql`
  mutation UpdateConnection($id: Int!, $data: JSONObject!) {
    updateConnection(id: $id, data: $data) {
      id
      key
      verified
      data {
        screenName
      }
    }
  }
`;
