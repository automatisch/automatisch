import { gql } from '@apollo/client';

export const GET_APPS = gql`
  query GetApps($name: String) {
    getApps(name: $name) {
      name
      key
      iconUrl
      docUrl
      primaryColor
      connectionCount
      fields {
        key
        label
        type
        required
        readOnly
        value
        placeholder
        description
        docUrl
        clickToCopy
      }
      authenticationSteps {
        step
        type
        name
        arguments {
          name
          value
          type
          properties {
            name
            value
          }
        }
      }
      reconnectionSteps {
        step
        type
        name
        arguments {
          name
          value
          type
          properties {
            name
            value
          }
        }
      }
      connections {
        id
      }
      triggers {
        name
        key
        description
        subSteps {
          name
        }
      }
      actions {
        name
        key
        description
        subSteps {
          name
        }
      }
    }
  }
`;