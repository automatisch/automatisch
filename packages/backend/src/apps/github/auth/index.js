import generateAuthUrl from './generate-auth-url.js';
import verifyCredentials from './verify-credentials.js';
import isStillVerified from './is-still-verified.js';

export default {
  fields: [
    {
      key: 'oAuthRedirectUrl',
      label: 'OAuth Redirect URL',
      type: 'string',
      required: true,
      readOnly: true,
      value: '{WEB_APP_URL}/app/github/connections/add',
      placeholder: null,
      description:
        'When asked to input an OAuth callback or redirect URL in Github OAuth, enter the URL above.',
      docUrl: 'https://automatisch.io/docs/github#oauth-redirect-url',
      clickToCopy: true,
    },
    {
      key: 'consumerKey',
      label: 'Client ID',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: null,
      docUrl: 'https://automatisch.io/docs/github#client-id',
      clickToCopy: false,
    },
    {
      key: 'consumerSecret',
      label: 'Client Secret',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: null,
      docUrl: 'https://automatisch.io/docs/github#client-secret',
      clickToCopy: false,
    },
  ],

  generateAuthUrl,
  verifyCredentials,
  isStillVerified,
};
