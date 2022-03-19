import { gql } from '@apollo/client';

export const GET_APPS = gql`
  query GetApps($name: String, $onlyWithTriggers: Boolean) {
    getApps(name: $name, onlyWithTriggers: $onlyWithTriggers) {
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
      triggers {
        name
        key
        description
        substeps {
          key
          name
          arguments {
            label
            key
            type
            required
          }
        }
      }
      actions {
        name
        key
        description
        substeps {
          key
          name
          arguments {
            label
            key
            type
            required
            description
            variables
            source {
              type
              name
              arguments {
                name
                value
              }
            }
          }
        }
      }
    }
  }
`;
