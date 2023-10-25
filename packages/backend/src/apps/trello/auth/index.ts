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
      value: '{WEB_APP_URL}/app/trello/connections/add',
      placeholder: null,
      description: '',
      clickToCopy: true,
    },
    {
      key: 'apiKey',
      label: 'API Key',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'API Key for your Trello account',
      clickToCopy: false,
    },
  ],

  generateAuthUrl,
  verifyCredentials,
  isStillVerified,
};
