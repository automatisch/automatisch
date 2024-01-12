import generateAuthUrl from './generate-auth-url.js';
import verifyCredentials from './verify-credentials.js';
import isStillVerified from './is-still-verified.js';
import refreshToken from './refresh-token.js';

export default {
  fields: [
    {
      key: 'oAuthRedirectUrl',
      label: 'OAuth Redirect URL',
      type: 'string',
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
      type: 'dropdown',
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
      type: 'string',
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
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: null,
      clickToCopy: false,
    },
  ],

  refreshToken,
  generateAuthUrl,
  verifyCredentials,
  isStillVerified,
};
