import { gql } from '@apollo/client';

export const GET_BILLING_AND_USAGE = gql`
  query GetBillingAndUsage {
    getBillingAndUsage {
      subscription {
        status
        monthlyQuota {
          title
          action {
            type
            text
            src
          }
        }
        nextBillDate {
          title
          action {
            type
            text
            src
          }
        }
        nextBillAmount {
          title
          action {
            type
            text
            src
          }
        }
      }
      usage {
        task
      }
    }
  }
`;

