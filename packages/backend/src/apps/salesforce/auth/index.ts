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
      value: '{WEB_APP_URL}/app/salesforce/connections/add',
      placeholder: null,
      description:
        'When asked to input an OAuth callback or redirect URL in Salesforce OAuth, enter the URL above.',
      clickToCopy: true,
    },
    {
      key: 'oauth2Url',
      label: 'Salesforce Environment',
      type: 'dropdown' as const,
      required: true,
      readOnly: false,
      value: 'https://login.salesforce.com/services/oauth2',
      placeholder: null,
      description: 'Most people should choose the default, "production".',
      clickToCopy: false,
      options: [
        {
          label: 'production',
          value: 'https://login.salesforce.com/services/oauth2',
        },
        {
          label: 'sandbox',
          value: 'https://test.salesforce.com/services/oauth2',
        },
      ],
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
      clickToCopy: false,
    },
  ],
  authenticationSteps: [
    {
      step: 1,
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
              name: 'oauth2Url',
              value: '{fields.oauth2Url}',
            },
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
      step: 2,
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
      step: 3,
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
      step: 4,
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
              name: 'code',
              value: '{openAuthPopup.code}',
            },
          ],
        },
      ],
    },
    {
      step: 5,
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
