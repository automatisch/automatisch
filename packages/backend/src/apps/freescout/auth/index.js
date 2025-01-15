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
      label: 'FreeScout instance URL',
      type: 'string',
      required: true,
      readOnly: false,
      value: 'https://freescout.net',
      placeholder: 'https://freescout.net',
      description: 'Your FreeScout instance URL. Default is https://freescout.net.',
      docUrl: 'https://automatisch.io/docs/gitlab#oauth-redirect-url',
      clickToCopy: false,
    },
    {
      key: 'apiKey',
      label: 'API Key',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'FreeScout API key of your account.',
      docUrl: 'https://automatisch.io/docs/openai#api-key',
      clickToCopy: false,
    },
  ],

  verifyCredentials,
  isStillVerified,
};
