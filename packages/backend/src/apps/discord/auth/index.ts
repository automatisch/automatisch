import createAuthData from './create-auth-data';
import verifyCredentials from './verify-credentials';
import isStillVerified from './is-still-verified';

export default {
  fields: [
    {
      key: 'oAuthRedirectUrl',
      label: 'OAuth Redirect URL',
      type: 'string' as const,
      required: true,
      readOnly: true,
      value: '{WEB_APP_URL}/app/discord/connections/add',
      placeholder: null,
      description: 'When asked to input an OAuth callback or redirect URL in Discord OAuth, enter the URL above.',
      docUrl: 'https://automatisch.io/docs/discord#oauth-redirect-url',
      clickToCopy: true
    },
    {
      key: 'consumerKey',
      label: 'Consumer Key',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: null,
      docUrl: 'https://automatisch.io/docs/discord#consumer-key',
      clickToCopy: false
    },
    {
      key: 'consumerSecret',
      label: 'Consumer Secret',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: null,
      docUrl: 'https://automatisch.io/docs/discord#consumer-secret',
      clickToCopy: false
    },
    {
      key: 'botToken',
      label: 'Bot token',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: null,
      docUrl: 'https://automatisch.io/docs/discord#bot-token',
      clickToCopy: false
    }
  ],
  authenticationSteps: [
    {
      step: 1,
      type: 'mutation' as const,
      name: 'createConnection',
      arguments: [
        {
          name: 'key',
          value: '{key}'
        },
        {
          name: 'formattedData',
          value: null,
          properties: [
            {
              name: 'consumerKey',
              value: '{fields.consumerKey}'
            },
            {
              name: 'consumerSecret',
              value: '{fields.consumerSecret}'
            },
            {
              name: 'botToken',
              value: '{fields.botToken}'
            }
          ]
        }
      ]
    },
    {
      step: 2,
      type: 'mutation' as const,
      name: 'createAuthData',
      arguments: [
        {
          name: 'id',
          value: '{createConnection.id}'
        }
      ]
    },
    {
      step: 3,
      type: 'openWithPopup' as const,
      name: 'openAuthPopup',
      arguments: [
        {
          name: 'url',
          value: '{createAuthData.url}'
        }
      ]
    },
    {
      step: 4,
      type: 'mutation' as const,
      name: 'updateConnection',
      arguments: [
        {
          name: 'id',
          value: '{createConnection.id}'
        },
        {
          name: 'formattedData',
          value: null,
          properties: [
            {
              name: 'oauthVerifier',
              value: '{openAuthPopup.code}'
            }
          ]
        }
      ]
    },
    {
      step: 5,
      type: 'mutation' as const,
      name: 'verifyConnection',
      arguments: [
        {
          name: 'id',
          value: '{createConnection.id}'
        }
      ]
    }
  ],
  reconnectionSteps: [
    {
      step: 1,
      type: 'mutation' as const,
      name: 'resetConnection',
      arguments: [
        {
          name: 'id',
          value: '{connection.id}'
        }
      ]
    },
    {
      step: 2,
      type: 'mutation' as const,
      name: 'updateConnection',
      arguments: [
        {
          name: 'id',
          value: '{connection.id}'
        },
        {
          name: 'formattedData',
          value: null,
          properties: [
            {
              name: 'consumerKey',
              value: '{fields.consumerKey}'
            },
            {
              name: 'consumerSecret',
              value: '{fields.consumerSecret}'
            },
            {
              name: 'botToken',
              value: '{fields.botToken}'
            }
          ]
        }
      ]
    },
    {
      step: 3,
      type: 'mutation' as const,
      name: 'createAuthData',
      arguments: [
        {
          name: 'id',
          value: '{connection.id}'
        }
      ]
    },
    {
      step: 4,
      type: 'openWithPopup' as const,
      name: 'openAuthPopup',
      arguments: [
        {
          name: 'url',
          value: '{createAuthData.url}'
        }
      ]
    },
    {
      step: 5,
      type: 'mutation' as const,
      name: 'updateConnection',
      arguments: [
        {
          name: 'id',
          value: '{connection.id}'
        },
        {
          name: 'formattedData',
          value: null,
          properties: [
            {
              name: 'oauthVerifier',
              value: '{openAuthPopup.code}'
            }
          ]
        }
      ]
    },
    {
      step: 6,
      type: 'mutation' as const,
      name: 'verifyConnection',
      arguments: [
        {
          name: 'id',
          value: '{connection.id}'
        }
      ]
    }
  ],

  createAuthData,
  verifyCredentials,
  isStillVerified,
};
