import verifyCredentials from './verify-credentials.js';
import isStillVerified from './is-still-verified.js';

export default {
  fields: [
    {
      clickToCopy: false,
      description: 'Found in your developer dashboard.',
      key: 'apiKey',
      label: 'API Key',
      placeholder: null,
      readOnly: false,
      required: true,
      type: 'string',
      value: null,
    },
  ],

  verifyCredentials,
  isStillVerified,
};
