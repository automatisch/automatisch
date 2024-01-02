import verifyCredentials from './verify-credentials';
import isStillVerified from './is-still-verified';

export default {
  fields: [
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
      key: 'apiUrl',
      label: 'API URL',
      type: 'string' as const,
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
      type: 'string' as const,
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
