import { gql } from '@apollo/client';

export const RESET_PASSWORD = gql`
  mutation ResetPassword($input: ResetPasswordInput) {
    resetPassword(input: $input)
  }
`;
