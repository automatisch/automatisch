import { gql } from '@apollo/client';

export const GET_FLOWS = gql`
  query GetFlows($limit: Int!, $offset: Int!, $appKey: String) {
    getFlows(limit: $limit, offset: $offset, appKey: $appKey) {
      pageInfo {
        currentPage
        totalPages
      }
      edges {
        node {
          id
          name
          createdAt
          updatedAt
          steps {
            iconUrl
          }
        }
      }
    }
  }
`;
