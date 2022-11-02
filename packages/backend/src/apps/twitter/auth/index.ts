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
      value: '{WEB_APP_URL}/app/twitter/connections/add',
      placeholder: null,
      description:
        'When asked to input an OAuth callback or redirect URL in Twitter OAuth, enter the URL above.',
      clickToCopy: true,
    },
    {
      key: 'consumerKey',
      label: 'API Key',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: null,
      clickToCopy: false,
    },
    {
      key: 'consumerSecret',
      label: 'API Secret',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: null,
      clickToCopy: false,
    },
  ],
  authenticationSteps: [
    {
      type: 'mutation' as const,
      name: 'createConnection',
      arguments: [
        {
          name: 'key',
          value: '{key}',
        },
        {
          name: 'formattedData',
          value: null,
          properties: [
            {
              name: 'consumerKey',
              value: '{fields.consumerKey}',
            },
            {
              name: 'consumerSecret',
              value: '{fields.consumerSecret}',
            },
          ],
        },
      ],
    },
    {
      type: 'mutation' as const,
      name: 'createAuthData',
      arguments: [
        {
          name: 'id',
          value: '{createConnection.id}',
        },
      ],
    },
    {
      type: 'openWithPopup' as const,
      name: 'openAuthPopup',
      arguments: [
        {
          name: 'url',
          value: '{createAuthData.url}',
        },
      ],
    },
    {
      type: 'mutation' as const,
      name: 'updateConnection',
      arguments: [
        {
          name: 'id',
          value: '{createConnection.id}',
        },
        {
          name: 'formattedData',
          value: null,
          properties: [
            {
              name: 'oauthVerifier',
              value: '{openAuthPopup.oauth_verifier}',
            },
          ],
        },
      ],
    },
    {
      type: 'mutation' as const,
      name: 'verifyConnection',
      arguments: [
        {
          name: 'id',
          value: '{createConnection.id}',
        },
      ],
    },
  ],
  reconnectionSteps: [
    {
      type: 'mutation' as const,
      name: 'resetConnection',
      arguments: [
        {
          name: 'id',
          value: '{connection.id}',
        },
      ],
    },
    {
      type: 'mutation' as const,
      name: 'updateConnection',
      arguments: [
        {
          name: 'id',
          value: '{connection.id}',
        },
        {
          name: 'formattedData',
          value: null,
          properties: [
            {
              name: 'consumerKey',
              value: '{fields.consumerKey}',
            },
            {
              name: 'consumerSecret',
              value: '{fields.consumerSecret}',
            },
          ],
        },
      ],
    },
    {
      type: 'mutation' as const,
      name: 'createAuthData',
      arguments: [
        {
          name: 'id',
          value: '{connection.id}',
        },
      ],
    },
    {
      type: 'openWithPopup' as const,
      name: 'openAuthPopup',
      arguments: [
        {
          name: 'url',
          value: '{createAuthData.url}',
        },
      ],
    },
    {
      type: 'mutation' as const,
      name: 'updateConnection',
      arguments: [
        {
          name: 'id',
          value: '{connection.id}',
        },
        {
          name: 'formattedData',
          value: null,
          properties: [
            {
              name: 'oauthVerifier',
              value: '{openAuthPopup.oauth_verifier}',
            },
          ],
        },
      ],
    },
    {
      type: 'mutation' as const,
      name: 'verifyConnection',
      arguments: [
        {
          name: 'id',
          value: '{connection.id}',
        },
      ],
    },
  ],

  createAuthData,
  verifyCredentials,
  isStillVerified,
};
