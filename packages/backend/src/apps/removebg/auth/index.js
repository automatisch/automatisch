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
      description: 'Screen name of your connection to be shown in the UI.',
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
      description: 'API key of the remove.bg API service.',
      clickToCopy: false,
    },
    {
      key: 'apiBaseUrl',
      label: 'API base URL (optional)',
      type: 'string',
      required: false,
      readOnly: false,
      value: null,
      placeholder: 'https://api.remove.bg/v1.0',
      description:
        'Leave blank to use remove.bg. Set it to use another API that accepts the same requests as remove.bg.',
      clickToCopy: false,
    },
  ],

  verifyCredentials,
  isStillVerified,
};
