import { gql } from '@apollo/client';

export const HEALTHCHECK = gql`
  query Healthcheck {
    healthcheck {
      version
    }
  }
`;
