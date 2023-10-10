import { gql } from '@apollo/client';

export const CREATE_APP_CONFIG = gql`
  mutation CreateAppConfig($input: CreateAppConfigInput) {
    createAppConfig(input: $input) {
      id
      key
      allowCustomConnection
      shared
      disabled
    }
  }
`;
