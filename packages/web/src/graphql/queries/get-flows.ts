import { gql } from '@apollo/client';

export const GET_FLOWS = gql`
  query GetFlows {
    getFlows {
      id
      name
    }
  }
`;