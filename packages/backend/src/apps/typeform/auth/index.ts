import generateAuthUrl from './generate-auth-url';
import verifyCredentials from './verify-credentials';
import isStillVerified from './is-still-verified';
import refreshToken from './refresh-token';
import verifyWebhook from './verify-webhook';

export default {
  fields: [
    {
      key: 'oAuthRedirectUrl',
      label: 'OAuth Redirect URL',
      type: 'string' as const,
      required: true,
      readOnly: true,
      value: '{WEB_APP_URL}/app/typeform/connections/add',
      placeholder: null,
      description:
        'When asked to input an OAuth callback or redirect URL in Typeform OAuth, enter the URL above.',
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
      clickToCopy: false,
    },
  ],

  generateAuthUrl,
  verifyCredentials,
  isStillVerified,
  refreshToken,
  verifyWebhook,
};
