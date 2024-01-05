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
      type: 'string',
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
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: null,
      docUrl: 'https://automatisch.io/docs/flickr#consumer-secret',
      clickToCopy: false,
    },
  ],
  generateAuthUrl,
  verifyCredentials,
  isStillVerified,
};
