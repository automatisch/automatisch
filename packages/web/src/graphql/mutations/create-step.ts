import { gql } from '@apollo/client';

export const CREATE_STEP = gql`
  mutation CreateStep($input: StepInput!) {
    createStep(input: $input) {
      id
      type
      key
      appKey
      parameters
      status
      connection {
        id
      }
    }
  }
`;
