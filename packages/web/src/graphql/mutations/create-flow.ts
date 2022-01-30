import { gql } from '@apollo/client';

export const CREATE_FLOW = gql`
  mutation createFlow($input: FlowInput) {
    createFlow(input: $input) {
      id
      name
    }
  }
`;
