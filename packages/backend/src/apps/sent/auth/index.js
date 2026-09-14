import verifyCredentials from './verify-credentials.js';
import isStillVerified from './is-still-verified.js';
import verifyWebhook from './verify-webhook.js';

export default {
  fields: [
    {
      key: 'apiKey',
      label: 'API Key',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description:
        'Sent API key. Create one in the Sent dashboard under Development → API Keys.',
      clickToCopy: false,
    },
  ],

  // Reconnecting keeps the per-flow webhook signing secrets stored in the
  // connection data: the key is updated (merged) and verified instead of the
  // default reset-then-update steps, which would drop them.
  reconnectionSteps: [
    {
      type: 'mutation',
      name: 'updateConnection',
      arguments: [
        {
          name: 'formattedData',
          value: '{fields.all}',
        },
      ],
    },
    {
      type: 'mutation',
      name: 'verifyConnection',
      arguments: [],
    },
  ],

  verifyCredentials,
  isStillVerified,
  verifyWebhook,
};
