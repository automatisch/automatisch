import { gql } from '@apollo/client';

export const DELETE_FLOW = gql`
  mutation DeleteFlow($input: DeleteFlowInput) {
    deleteFlow(input: $input)
  }
`;
