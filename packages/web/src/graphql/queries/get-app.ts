import { gql } from '@apollo/client';

export const GET_APP = gql`
  query GetApp($key: AvailableAppsEnumType!) {
    getApp(key: $key) {
      name
      key
      iconUrl
      docUrl
      authDocUrl
      primaryColor
      supportsConnections
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
        substeps {
          name
        }
      }
      actions {
        name
        key
        description
        substeps {
          name
        }
      }
    }
  }
`;
