import verifyCredentials from './verify-credentials.js';
import isStillVerified from './is-still-verified.js';

export default {
  fields: [
    {
      key: 'screenName',
      label: 'Screen Name',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description:
        'Screen name of your connection to be used on Automatisch UI.',
      clickToCopy: false,
    },
    {
      key: 'instanceUrl',
      label: 'Instance URL',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Your subdomain as https://{yoursubdomain}.airbrake.io',
      clickToCopy: false,
    },
    {
      key: 'authToken',
      label: 'Auth Token',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Airbrake Auth Token of your account.',
      clickToCopy: false,
    },
  ],

  verifyCredentials,
  isStillVerified,
};
