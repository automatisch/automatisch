import verifyCredentials from './verify-credentials.js';
import isStillVerified from './is-still-verified.js';

export default {
  fields: [
    {
      key: 'accessToken',
      label: 'Access Token',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'You can find your Automatisch Token in Wauld under Integrations >> Automatisch Integration. Click Generate Token, then copy and paste the token here.',
      clickToCopy: false,
    },
    {
      key: 'accountId',
      label: 'Account ID',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'You can find your Wauld Account ID in the URL after wauld.com/. It starts with acc_. Copy and paste it here.',
      clickToCopy: false,
    },
  ],
  verifyCredentials,
  isStillVerified,
};