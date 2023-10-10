import { gql } from '@apollo/client';

export const GET_APPS = gql`
  query GetApps(
    $name: String
    $onlyWithTriggers: Boolean
    $onlyWithActions: Boolean
  ) {
    getApps(
      name: $name
      onlyWithTriggers: $onlyWithTriggers
      onlyWithActions: $onlyWithActions
    ) {
      name
      key
      iconUrl
      docUrl
      authDocUrl
      primaryColor
      connectionCount
      flowCount
      supportsConnections
      auth {
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
          options {
            label
            value
          }
        }
        authenticationSteps {
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
        sharedAuthenticationSteps {
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
        sharedReconnectionSteps {
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
      }
      triggers {
        name
        key
        type
        showWebhookUrl
        pollInterval
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
            dependsOn
            options {
              label
              value
            }
            source {
              type
              name
              arguments {
                name
                value
              }
            }
            additionalFields {
              type
              name
              arguments {
                name
                value
              }
            }
            fields {
              label
              key
              type
              required
              description
              variables
              value
              dependsOn
              options {
                label
                value
              }
              source {
                type
                name
                arguments {
                  name
                  value
                }
              }
              additionalFields {
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
            dependsOn
            value
            options {
              label
              value
            }
            source {
              type
              name
              arguments {
                name
                value
              }
            }
            additionalFields {
              type
              name
              arguments {
                name
                value
              }
            }
            fields {
              label
              key
              type
              required
              description
              variables
              value
              dependsOn
              options {
                label
                value
              }
              source {
                type
                name
                arguments {
                  name
                  value
                }
              }
              additionalFields {
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
  }
`;
