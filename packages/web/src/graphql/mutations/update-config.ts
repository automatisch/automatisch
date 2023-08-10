import { gql } from '@apollo/client';

export const UPDATE_CONFIG = gql`
  mutation UpdateConfig($input: JSONObject) {
    updateConfig(input: $input)
  }
`;
