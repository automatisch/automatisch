import { gql } from '@apollo/client';

export const GET_PAYMENT_PLANS = gql`
  query GetPaymentPlans {
    getPaymentPlans {
      name
      limit
      price
      productId
    }
  }
`;
