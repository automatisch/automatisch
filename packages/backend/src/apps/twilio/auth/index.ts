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
  authenticationSteps: [
    {
      type: 'mutation' as const,
      name: 'createConnection',
      arguments: [
        {
          name: 'key',
          value: '{key}',
        },
        {
          name: 'formattedData',
          value: null,
          properties: [
            {
              name: 'accountSid',
              value: '{fields.accountSid}',
            },
            {
              name: 'authToken',
              value: '{fields.authToken}',
            },
          ],
        },
      ],
    },
    {
      type: 'mutation' as const,
      name: 'verifyConnection',
      arguments: [
        {
          name: 'id',
          value: '{createConnection.id}',
        },
      ],
    },
  ],

  verifyCredentials,
  isStillVerified,
};
