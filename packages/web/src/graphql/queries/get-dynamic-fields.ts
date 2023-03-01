import { gql } from '@apollo/client';

export const GET_DYNAMIC_FIELDS = gql`
  query GetDynamicFields(
    $stepId: String!
    $key: String!
    $parameters: JSONObject
  ) {
    getDynamicFields(stepId: $stepId, key: $key, parameters: $parameters) {
      label
      key
      type
      required
      description
      options {
        label
        value
      }
    }
  }
`;
