import { gql } from '@apollo/client';

export const GET_APPS = gql`
  query GetApps($name: String) {
    getApps(name: $name) {
      key
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
      connections {
        id
      }
    }
  }
`;