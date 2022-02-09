import { gql } from '@apollo/client';

export const EXECUTE_FLOW = gql`
  mutation ExecuteFlow($stepId: String!) {
    executeFlow(stepId: $stepId) {
      step {
        id
        status
      }
      data
    }
  }
`;
