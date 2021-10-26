import { gql } from '@apollo/client';

export const CREATE_AUTH_DATA = gql`
  mutation createAuthData($id: String!) {
    createAuthData(id: $id) {
      url
    }
  }
`;
