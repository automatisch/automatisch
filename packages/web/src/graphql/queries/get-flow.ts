import { gql } from '@apollo/client';

export const GET_FLOW = gql`
  query GetFlow($id: Int!) {
    getFlow(id: $id) {
      id
      name
      steps {
        id
        type
        key
        appKey
        connectionId
      }
    }
  }
`;
