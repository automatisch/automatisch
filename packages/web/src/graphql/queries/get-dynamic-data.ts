import { gql } from '@apollo/client';

export const GET_DYNAMIC_DATA = gql`
  query GetDynamicData(
    $stepId: String!
    $key: String!
    $parameters: JSONObject
  ) {
    getDynamicData(stepId: $stepId, key: $key, parameters: $parameters)
  }
`;
