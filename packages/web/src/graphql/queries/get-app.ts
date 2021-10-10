import { gql } from '@apollo/client';

export const GET_APP = gql`
  query GetApp($name: String!) {
    getApp (name: $name) {
      name
      iconUrl
      docUrl
      primaryColor
      fields {
        key
        label
        type
        required
        readOnly
        placeholder
        description
        docUrl
        clickToCopy
      }
    }
  }
`;
