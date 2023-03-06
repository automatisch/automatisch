import { gql } from '@apollo/client';

export const GET_AUTOMATISCH_INFO = gql`
  query GetAutomatischInfo {
    getAutomatischInfo {
      isCloud
    }
  }
`;

