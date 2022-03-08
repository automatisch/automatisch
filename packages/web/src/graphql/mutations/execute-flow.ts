import { gql } from '@apollo/client';

export const EXECUTE_FLOW = gql`
  mutation ExecuteFlow($input: ExecuteFlowInput) {
    executeFlow(input: $input) {
      step {
        id
        status
      }
      data
    }
  }
`;
