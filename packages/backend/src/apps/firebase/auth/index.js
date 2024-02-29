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
      value: '{WEB_APP_URL}/app/firebase/connections/add',
      placeholder: null,
      description:
        'When asked to input a redirect URL in Google Cloud, enter the URL above.',
      clickToCopy: true,
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
    {
      key: 'projectId',
      label: 'Project ID',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'The project id of your Firebase project',
      clickToCopy: false,
    },
    {
      key: 'realtimeDatabaseId',
      label: 'Realtime Database Domain',
      type: 'string',
      required: false,
      readOnly: false,
      value: null,
      placeholder: null,
      description:
        'If you want to use Realtime Database, please provide the domain of your Realtime Database (https://{{domain}}.firebaseio.com)',
      clickToCopy: false,
    },
  ],

  generateAuthUrl,
  verifyCredentials,
  isStillVerified,
  refreshToken,
};
