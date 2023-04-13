import { gql } from '@apollo/client';

export const GET_SUBSCRIPTION_STATUS = gql`
  query GetSubscriptionStatus {
    getSubscriptionStatus {
      cancellationEffectiveDate
    }
  }
`;
