import verifyCredentials from './verify-credentials.js';
import isStillVerified from './is-still-verified.js';

export default {
  fields: [
    {
      key: 'integrationToken',
      label: 'Integration Token',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description:
        'Your Notion integration token. Create one at https://www.notion.so/my-integrations',
      docUrl: 'https://developers.notion.com/reference/intro',
      clickToCopy: false,
    },
  ],

  verifyCredentials,
  isStillVerified,
};
