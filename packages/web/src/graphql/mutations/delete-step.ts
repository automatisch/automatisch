import { gql } from '@apollo/client';

export const DELETE_STEP = gql`
  mutation DeleteStep($id: String!) {
    deleteStep(id: $id) {
      id
      flow {
        id
        steps {
          id
        }
      }
    }
  }
`;
