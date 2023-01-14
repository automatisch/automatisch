import { gql } from '@apollo/client';

export const UPDATE_STEP = gql`
  mutation UpdateStep($input: UpdateStepInput) {
    updateStep(input: $input) {
      id
      type
      key
      appKey
      parameters
      status
      webhookUrl
      connection {
        id
      }
    }
  }
`;
