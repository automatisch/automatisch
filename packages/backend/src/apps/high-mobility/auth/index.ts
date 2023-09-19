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
      value: '{WEB_APP_URL}/app/high-mobility/connections/add',
      placeholder: null,
      description:
        'When asked to input an OAuth callback or redirect URL in High Mobility OAuth, enter the URL above.',
      clickToCopy: true,
    },
    {
      key: 'screenName',
      label: 'Screen Name',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description:
        'Screen name of your connection to be used on Automatisch UI.',
      clickToCopy: false,
    },
    {
      key: 'clientId',
      label: 'Client ID',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Client ID of your High Mobility OAuth app.',
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
      description: 'Client Secret of your High Mobility OAuth app.',
      clickToCopy: false,
    },
    {
      key: 'privateKey',
      label: 'Private Key',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Private Key of your High Mobility OAuth app.',
      clickToCopy: false,
    },
    {
      key: 'appId',
      label: 'App ID',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'App ID of your High Mobility OAuth app.',
      clickToCopy: false,
    },
    {
      key: 'clientSerialNumber',
      label: 'Client Serial Number',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Client Serial Number of your High Mobility OAuth app.',
      clickToCopy: false,
    },
  ],

  generateAuthUrl,
  verifyCredentials,
  isStillVerified,
  refreshToken,
};
