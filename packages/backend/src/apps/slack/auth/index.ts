import verifyCredentials from './verify-credentials';
import isStillVerified from './is-still-verified';

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
      description: 'Access token of slack that Automatisch will connect to.',
      clickToCopy: false,
    },
  ],
  authenticationSteps: [
    {
      step: 1,
      type: 'mutation',
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
              name: 'accessToken',
              value: '{fields.accessToken}',
            },
          ],
        },
      ],
    },
    {
      step: 2,
      type: 'mutation',
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
      type: 'mutation',
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
      type: 'mutation',
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
              name: 'accessToken',
              value: '{fields.accessToken}',
            },
          ],
        },
      ],
    },
    {
      step: 3,
      type: 'mutation',
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
