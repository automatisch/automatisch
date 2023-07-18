import { gql } from '@apollo/client';

export const UPDATE_ROLE = gql`
  mutation UpdateRole($input: UpdateRoleInput) {
    updateRole(input: $input) {
      id
      name
      description
      permissions {
        id
        action
        subject
        conditions
      }
    }
  }
`;
