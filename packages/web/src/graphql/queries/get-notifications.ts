import { gql } from '@apollo/client';

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    getNotifications {
      name
      createdAt
      documentationUrl
      description
    }
  }
`;
