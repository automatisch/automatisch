import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers(
    $limit: Int!
    $offset: Int!
  ) {
    getUsers(
      limit: $limit
      offset: $offset
    ) {
      pageInfo {
        currentPage
        totalPages
      }
      totalCount
      edges {
        node {
          id
          fullName
          email
          role {
            id
            name
          }
        }
      }
    }
  }
`;
