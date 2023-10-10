import { gql } from '@apollo/client';

export const UPDATE_APP_CONFIG = gql`
  mutation UpdateAppConfig($input: UpdateAppConfigInput) {
    updateAppConfig(input: $input) {
      id
      key
      allowCustomConnection
      shared
      disabled
    }
  }
`;
