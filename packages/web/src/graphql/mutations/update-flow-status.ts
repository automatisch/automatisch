import { gql } from '@apollo/client';

export const UPDATE_FLOW_STATUS = gql`
  mutation UpdateFlowStatus($input: UpdateFlowStatusInput) {
    updateFlowStatus(input: $input) {
      id
      active
    }
  }
`;
