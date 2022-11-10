import { gql } from '@apollo/client';

export const GENERATE_AUTH_URL = gql`
  mutation generateAuthUrl($input: GenerateAuthUrlInput) {
    generateAuthUrl(input: $input) {
      url
    }
  }
`;
