import verifyCredentials from './verify-credentials';
import isStillVerified from './is-still-verified';

export default {
  fields: [
    {
      key: 'accountSid',
      label: 'Account SID',
      type: 'string' as const,
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
      type: 'string' as const,
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
