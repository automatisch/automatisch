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
      value: '{WEB_APP_URL}/app/flickr/connections/add',
      placeholder: null,
      description:
        'When asked to input an OAuth callback or redirect URL in Flickr OAuth, enter the URL above.',
      docUrl: 'https://automatisch.io/docs/flickr#oauth-redirect-url',
      clickToCopy: true,
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
      docUrl: 'https://automatisch.io/docs/flickr#consumer-key',
      clickToCopy: false,
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
      docUrl: 'https://automatisch.io/docs/flickr#consumer-secret',
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

  createAuthData,
  verifyCredentials,
  isStillVerified,
};
