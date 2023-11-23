import { gql } from '@apollo/client';

export const GET_SHARED_CONNECTION_ROLE_IDS = gql`
  query GetSharedConnectionRoleIds($id: String!) {
    getSharedConnectionRoleIds(id: $id)
  }
`;
