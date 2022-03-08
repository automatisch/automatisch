import { gql } from '@apollo/client';

export const DELETE_STEP = gql`
  mutation DeleteStep($input: DeleteStepInput) {
    deleteStep(input: $input) {
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
