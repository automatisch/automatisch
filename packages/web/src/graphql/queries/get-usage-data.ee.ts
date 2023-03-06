import { gql } from '@apollo/client';

export const GET_USAGE_DATA = gql`
  query GetUsageData {
    getUsageData {
      allowedTaskCount
      consumedTaskCount
      remainingTaskCount
      nextResetAt
    }
  }
`;

