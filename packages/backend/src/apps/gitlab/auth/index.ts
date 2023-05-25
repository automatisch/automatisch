import generateAuthUrl from './generate-auth-url';
import verifyCredentials from './verify-credentials';
import isStillVerified from './is-still-verified';
import refreshToken from './refresh-token';

export default {
  fields: [
    {
      key: 'oAuthRedirectUrl',
      label: 'OAuth Redirect URL',
      type: 'string' as const,
      required: true,
      readOnly: true,
      value: '{WEB_APP_URL}/app/gitlab/connections/add',
      placeholder: null,
      description:
        'When asked to input an OAuth callback or redirect URL in Gitlab OAuth, enter the URL above.',
      docUrl: 'https://automatisch.io/docs/gitlab#oauth-redirect-url',
      clickToCopy: true,
    },
    {
      key: 'instanceUrl',
      label: 'Gitlab instance URL',
      type: 'string' as const,
      required: false,
      readOnly: false,
      value: 'https://gitlab.com',
      placeholder: 'https://gitlab.com',
      description: 'Your Gitlab instance URL. Default is https://gitlab.com.',
      docUrl: 'https://automatisch.io/docs/gitlab#oauth-redirect-url',
      clickToCopy: true,
    },
    {
      key: 'clientId',
      label: 'Client ID',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: null,
      docUrl: 'https://automatisch.io/docs/gitlab#client-id',
      clickToCopy: false,
    },
    {
      key: 'clientSecret',
      label: 'Client Secret',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: null,
      docUrl: 'https://automatisch.io/docs/gitlab#client-secret',
      clickToCopy: false,
    },
  ],

  generateAuthUrl,
  refreshToken,
  verifyCredentials,
  isStillVerified,
};
