import { gql } from '@apollo/client';

export const DELETE_ROLE = gql`
  mutation DeleteRole($input: DeleteRoleInput) {
    deleteRole(input: $input)
  }
`;
