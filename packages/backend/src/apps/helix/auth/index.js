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
      label: 'Helix instance URL',
      type: 'string',
      required: false,
      readOnly: false,
      value: 'https://app.tryhelix.ai',
      placeholder: 'https://app.tryhelix.ai',
      description:
        'Your Helix instance URL. Default is https://app.tryhelix.ai.',
      clickToCopy: true,
    },
    {
      key: 'apiKey',
      label: 'API Key',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Helix API Key of your account.',
      clickToCopy: false,
    },
  ],

  verifyCredentials,
  isStillVerified,
};
