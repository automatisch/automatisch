import { gql } from '@apollo/client';

export const CREATE_AUTH_DATA = gql`
  mutation createAuthData($id: Int!) {
    createAuthData(id: $id) {
      url
    }
  }
`;
