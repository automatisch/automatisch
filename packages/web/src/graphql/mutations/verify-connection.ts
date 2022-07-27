import { gql } from '@apollo/client';

export const VERIFY_CONNECTION = gql`
  mutation VerifyConnection($input: VerifyConnectionInput) {
    verifyConnection(input: $input) {
      id
      key
      verified
      formattedData {
        screenName
      }
      createdAt
      app {
        key
      }
    }
  }
`;
