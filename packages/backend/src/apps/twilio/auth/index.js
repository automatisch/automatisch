import verifyCredentials from './verify-credentials.js';
import isStillVerified from './is-still-verified.js';

export default {
  fields: [
    {
      key: 'accountSid',
      label: 'Account SID',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description:
        'Log into your Twilio account and find "API Credentials" on this page https://www.twilio.com/user/account/settings',
      clickToCopy: false,
    },
    {
      key: 'authToken',
      label: 'Auth Token',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Found directly below your Account SID.',
      clickToCopy: false,
    },
  ],

  verifyCredentials,
  isStillVerified,
};
