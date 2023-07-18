import { gql } from '@apollo/client';

export const GET_PERMISSION_CATALOG = gql`
  query GetPermissionCatalog {
    getPermissionCatalog {
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
        key
        subjects
      }
    }
  }
`;
