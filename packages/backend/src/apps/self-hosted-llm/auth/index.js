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
      key: 'apiUrl',
      label: 'API URL',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      docUrl: 'https://automatisch.io/docs/self-hosted-llm#api-url',
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
      docUrl: 'https://automatisch.io/docs/self-hosted-llm#api-key',
      clickToCopy: false,
    },
  ],

  verifyCredentials,
  isStillVerified,
};
