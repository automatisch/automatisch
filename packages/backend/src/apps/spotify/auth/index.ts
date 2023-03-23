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
      value: '{WEB_APP_URL}/app/spotify/connections/add',
      placeholder: null,
      description:
        'When asked to input an OAuth callback or redirect URL in Spotify OAuth, enter the URL above.',
      clickToCopy: true,
    },
    {
      key: 'clientId',
      label: 'Client Id',
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
  refreshToken,
  generateAuthUrl,
  verifyCredentials,
  isStillVerified,
};
