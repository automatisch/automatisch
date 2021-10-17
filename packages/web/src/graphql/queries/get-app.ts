import { gql } from '@apollo/client';

export const GET_APP = gql`
  query GetApp($key: String!) {
    getApp (key: $key) {
      name
      key
      iconUrl
      docUrl
      primaryColor
      fields {
        key
        label
        type
        required
        readOnly
        value
        description
        docUrl
        clickToCopy
      }
      authenticationSteps {
        step
        type
        name
        fields {
          name
          value
          fields {
            name
            value
          }
        }
      }
    }
  }
`;
