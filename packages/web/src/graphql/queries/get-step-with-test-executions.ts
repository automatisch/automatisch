import { gql } from '@apollo/client';

export const GET_STEP_WITH_TEST_EXECUTIONS = gql`
  query GetStepWithTestExecutions($stepId: String!) {
    getStepWithTestExecutions(stepId: $stepId) {
      id
      appKey
      executionSteps {
        id
        executionId
        stepId
        status
        dataOut
      }
    }
  }
`;
