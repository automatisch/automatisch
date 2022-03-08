import { gql } from '@apollo/client';

export const UPDATE_FLOW = gql`
  mutation UpdateFlow($input: UpdateFlowInput) {
    updateFlow(input: $input) {
      id
      name
    }
  }
`;
