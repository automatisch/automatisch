import { gql } from '@apollo/client';

export const UPDATE_CONNECTION = gql`
  mutation UpdateConnection($input: UpdateConnectionInput) {
    updateConnection(input: $input) {
      id
      key
      verified
      formattedData {
        screenName
      }
    }
  }
`;
