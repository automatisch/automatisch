import { gql } from '@apollo/client';

export const GET_APP = gql`
  query GetApp($name: String!) {
    getApp (name: $name) {
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
