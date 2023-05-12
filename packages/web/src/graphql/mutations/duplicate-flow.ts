import { gql } from '@apollo/client';

export const DUPLICATE_FLOW = gql`
  mutation DuplicateFlow($input: DuplicateFlowInput) {
    duplicateFlow(input: $input) {
      id
      name
      active
      status
      steps {
        id
        type
        key
        appKey
        iconUrl
        webhookUrl
        status
        position
        connection {
          id
          verified
          createdAt
        }
        parameters
      }
    }
  }
`;
