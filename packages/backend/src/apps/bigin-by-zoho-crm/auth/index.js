import generateAuthUrl from './generate-auth-url.js';
import verifyCredentials from './verify-credentials.js';
import refreshToken from './refresh-token.js';
import isStillVerified from './is-still-verified.js';

export default {
  fields: [
    {
      key: 'oAuthRedirectUrl',
      label: 'OAuth Redirect URL',
      type: 'string',
      required: true,
      readOnly: true,
      value: '{WEB_APP_URL}/app/bigin-by-zoho-crm/connections/add',
      placeholder: null,
      description:
        'When asked to input a redirect URL in Bigin By Zoho CRM, enter the URL above.',
      clickToCopy: true,
    },
    {
      key: 'region',
      label: 'Region',
      type: 'dropdown',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: '',
      options: [
        { label: 'United States', value: 'us' },
        { label: 'European Union', value: 'eu' },
        { label: 'Australia', value: 'au' },
        { label: 'India', value: 'in' },
        { label: 'China', value: 'cn' },
      ],
      clickToCopy: false,
    },
    {
      key: 'clientId',
      label: 'Client ID',
      type: 'string',
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
      type: 'string',
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
};
