import verifyCredentials from './verify-credentials.js';
import isStillVerified from './is-still-verified.js';

export default {
  fields: [
    {
      key: 'apiUrl',
      label: 'API URL',
      type: 'string',
      required: false,
      readOnly: false,
      value: 'https://api.jotform.com',
      placeholder: 'https://${subdomain}.jotform.com/api',
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
      clickToCopy: false,
    },
  ],

  verifyCredentials,
  isStillVerified,
};
