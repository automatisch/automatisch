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
      description:
        'Tokens can be created in the v5 app on Settings > Account Management',
      clickToCopy: false,
    },
    {
      key: 'instanceUrl',
      label: 'Invoice Ninja instance URL (optional)',
      type: 'string',
      required: false,
      readOnly: false,
      value: null,
      placeholder: null,
      description: "Leave this field blank if you're using hosted platform.",
      clickToCopy: true,
    },
  ],

  verifyCredentials,
  isStillVerified,
};
