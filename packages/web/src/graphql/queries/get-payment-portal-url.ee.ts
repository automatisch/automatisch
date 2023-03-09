import { gql } from '@apollo/client';

export const GET_PAYMENT_PORTAL_URL = gql`
  query GetPaymentPortalUrl {
    getPaymentPortalUrl {
      url
    }
  }
`;

