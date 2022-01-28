import { gql } from '@apollo/client';

export const UPDATE_STEP = gql`
  mutation UpdateStep($input: StepInput!) {
    updateStep(input: $input) {
      id
      type
      key
      appKey
      parameters
      connection {
        id
      }
    }
  }
`;
