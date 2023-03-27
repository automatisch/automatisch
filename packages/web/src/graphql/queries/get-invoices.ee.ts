import { gql } from '@apollo/client';

export const GET_INVOICES = gql`
  query GetInvoices {
    getInvoices {
      id
      amount
      currency
      payout_date
      receipt_url
    }
  }
`;

