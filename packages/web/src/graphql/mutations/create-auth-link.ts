import { gql } from '@apollo/client';

export const CREATE_AUTH_LINK = gql`
  mutation CreateAuthLink($id: String!) {
    createAuthLink(id: $id) {
      url
    }
  }
`;
