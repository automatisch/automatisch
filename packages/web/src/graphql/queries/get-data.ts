import { gql } from '@apollo/client';

export const GET_DATA = gql`
  query GetData($stepId: String!, $key: String!, $parameters: JSONObject) {
    getData(stepId: $stepId, key: $key, parameters: $parameters)
  }
`;
