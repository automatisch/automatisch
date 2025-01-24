import verifyCredentials from './verify-credentials.js';
import isStillVerified from './is-still-verified.js';

export default {
  fields: [
    {
      key: 'apiToken',
      label: 'API Token',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Monday.com API token of your account.',
      clickToCopy: false,
    },
  ],

  verifyCredentials,
  isStillVerified,
};
