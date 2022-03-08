import { gql } from '@apollo/client';

export const CREATE_FLOW = gql`
  mutation CreateFlow($input: CreateFlowInput) {
    createFlow(input: $input) {
      id
      name
    }
  }
`;
