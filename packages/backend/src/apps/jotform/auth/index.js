import verifyCredentials from './verify-credentials.js';
import isStillVerified from './is-still-verified.js';

export default {
  fields: [
    {
      key: 'instanceUrl',
      label: 'Jotform instance URL',
      type: 'string',
      required: false,
      readOnly: false,
      value: null,
      placeholder: 'https://${subdomain}.jotform.com',
      description: 'If you have an enterprise plan, you can use your api url.',
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
      description: 'Jotform API key of your account.',
      clickToCopy: false,
    },
  ],

  verifyCredentials,
  isStillVerified,
};
