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
      step: 1,
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
      step: 2,
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
  reconnectionSteps: [
    {
      step: 1,
      type: 'mutation' as const,
      name: 'resetConnection',
      arguments: [
        {
          name: 'id',
          value: '{connection.id}',
        },
      ],
    },
    {
      step: 2,
      type: 'mutation' as const,
      name: 'updateConnection',
      arguments: [
        {
          name: 'id',
          value: '{connection.id}',
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
      step: 3,
      type: 'mutation' as const,
      name: 'verifyConnection',
      arguments: [
        {
          name: 'id',
          value: '{connection.id}',
        },
      ],
    },
  ],

  verifyCredentials,
  isStillVerified,
};
