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
      value: '{WEB_APP_URL}/app/mattermost/connections/add',
      placeholder: null,
      description:
        'When asked to input an OAuth callback or redirect URL in Mattermost OAuth, enter the URL above.',
      clickToCopy: true,
    },
    {
      key: 'instanceUrl',
      label: 'Mattermost instance URL',
      type: 'string' as const,
      required: false,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Your Mattermost instance URL',
      clickToCopy: true,
    },
    {
      key: 'clientId',
      label: 'Client id',
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
      label: 'Client secret',
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
};
