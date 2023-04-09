import { gql } from '@apollo/client';

export const GET_TRIAL_STATUS = gql`
  query GetTrialStatus {
    getTrialStatus {
      expireAt
    }
  }
`;
