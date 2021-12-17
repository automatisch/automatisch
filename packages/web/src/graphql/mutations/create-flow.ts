import { gql } from '@apollo/client';

export const CREATE_FLOW = gql`
  mutation createFlow {
    createFlow {
      id
      name
    }
  }
`;
