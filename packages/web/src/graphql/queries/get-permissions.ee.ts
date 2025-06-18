import { gql } from '@apollo/client';

export const GET_PERMISSIONS = gql`
  query GetPermissions {
    getPermissions {
      subjects {
        key
        label
      }
      conditions {
        key
        label
      }
      actions {
        label
        action
        subjects
      }
    }
  }
`;
