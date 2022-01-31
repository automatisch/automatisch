import { gql } from '@apollo/client';

export const UPDATE_FLOW = gql`
  mutation UpdateFlow($id: String!, $name: String!) {
    updateFlow(id: $id, name: $name) {
      id
      name
    }
  }
`;
