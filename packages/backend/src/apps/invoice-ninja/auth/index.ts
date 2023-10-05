import verifyCredentials from './verify-credentials';
import isStillVerified from './is-still-verified';

export default {
  fields: [
    {
      key: 'apiToken',
      label: 'API Token',
      type: 'string' as const,
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
      type: 'string' as const,
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
