import { gql } from '@apollo/client';

export const GET_EXECUTION = gql`
  query GetExecution($executionId: String!) {
    getExecution(executionId: $executionId) {
      id
      testRun
      createdAt
      updatedAt
      flow {
        id
        name
        active
      }
    }
  }
`;
