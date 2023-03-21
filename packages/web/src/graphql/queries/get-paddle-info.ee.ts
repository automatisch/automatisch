import { gql } from '@apollo/client';

export const GET_PADDLE_INFO = gql`
  query GetPaddleInfo {
    getPaddleInfo {
      sandbox
      vendorId
    }
  }
`;
