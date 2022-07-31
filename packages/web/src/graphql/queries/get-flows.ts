import { gql } from '@apollo/client';

export const GET_FLOWS = gql`
  query GetFlows($appKey: String) {
    getFlows(appKey: $appKey) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;