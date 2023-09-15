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
      variables
      dependsOn
      value
      options {
        label
        value
      }
      source {
        type
        name
        arguments {
          name
          value
        }
      }
      additionalFields {
        type
        name
        arguments {
          name
          value
        }
      }
      fields {
        label
        key
        type
        required
        description
        variables
        value
        dependsOn
        options {
          label
          value
        }
        source {
          type
          name
          arguments {
            name
            value
          }
        }
        additionalFields {
          type
          name
          arguments {
            name
            value
          }
        }
      }
    }
  }
`;
