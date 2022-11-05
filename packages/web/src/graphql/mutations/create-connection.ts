import { gql } from '@apollo/client';

export const CREATE_CONNECTION = gql`
  mutation CreateConnection($input: CreateConnectionInput) {
    createConnection(input: $input) {
      id
      key
      verified
      formattedData {
        screenName
      }
    }
  }
`;
