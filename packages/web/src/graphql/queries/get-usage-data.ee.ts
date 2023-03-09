import { gql } from '@apollo/client';

export const GET_USAGE_DATA = gql`
  query GetUsageData {
    getUsageData {
      name
      allowedTaskCount
      consumedTaskCount
      remainingTaskCount
      nextResetAt
    }
  }
`;

