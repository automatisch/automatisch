import verifyCredentials from './verify-credentials';
import isStillVerified from './is-still-verified';

export default {
  fields: [
    {
      key: 'screenName',
      label: 'Screen Name',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description:
        'Screen name of your connection to be used on Automatisch UI.',
      clickToCopy: false,
    },
    {
      key: 'authenticationKey',
      label: 'Authentication Key',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'DeepL authentication key of your account.',
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
              name: 'screenName',
              value: '{fields.screenName}',
            },
            {
              name: 'authenticationKey',
              value: '{fields.authenticationKey}',
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
