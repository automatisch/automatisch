import generateAuthUrl from './generate-auth-url';
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
      description:
        'When asked to input an OAuth callback or redirect URL in Discord OAuth, enter the URL above.',
      docUrl: 'https://automatisch.io/docs/discord#oauth-redirect-url',
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
      docUrl: 'https://automatisch.io/docs/discord#consumer-key',
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
      docUrl: 'https://automatisch.io/docs/discord#consumer-secret',
      clickToCopy: false,
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
      clickToCopy: false,
    },
  ],

  generateAuthUrl,
  verifyCredentials,
  isStillVerified,
};
