import { IApp } from '@automatisch/types';

function addAuthenticationSteps(app: IApp): IApp {
  if (app.auth.generateAuthUrl) {
    app.auth.authenticationSteps = authenticationStepsWithAuthUrl;
    app.auth.sharedAuthenticationSteps = sharedAuthenticationStepsWithAuthUrl;
  } else {
    app.auth.authenticationSteps = authenticationStepsWithoutAuthUrl;
  }

  return app;
}

const authenticationStepsWithoutAuthUrl = [
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
        value: '{fields.all}',
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
];

const authenticationStepsWithAuthUrl = [
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
        value: '{fields.all}',
      },
    ],
  },
  {
    type: 'mutation' as const,
    name: 'generateAuthUrl',
    arguments: [
      {
        name: 'id',
        value: '{createConnection.id}',
      },
    ],
  },
  {
    type: 'openWithPopup' as const,
    name: 'openAuthPopup',
    arguments: [
      {
        name: 'url',
        value: '{generateAuthUrl.url}',
      },
    ],
  },
  {
    type: 'mutation' as const,
    name: 'updateConnection',
    arguments: [
      {
        name: 'id',
        value: '{createConnection.id}',
      },
      {
        name: 'formattedData',
        value: '{openAuthPopup.all}',
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
];

const sharedAuthenticationStepsWithAuthUrl = [
  {
    type: 'mutation' as const,
    name: 'createConnection',
    arguments: [
      {
        name: 'key',
        value: '{key}',
      },
      {
        name: 'appAuthClientId',
        value: '{appAuthClientId}',
      },
    ],
  },
  {
    type: 'mutation' as const,
    name: 'generateAuthUrl',
    arguments: [
      {
        name: 'id',
        value: '{createConnection.id}',
      },
    ],
  },
  {
    type: 'openWithPopup' as const,
    name: 'openAuthPopup',
    arguments: [
      {
        name: 'url',
        value: '{generateAuthUrl.url}',
      },
    ],
  },
  {
    type: 'mutation' as const,
    name: 'updateConnection',
    arguments: [
      {
        name: 'id',
        value: '{createConnection.id}',
      },
      {
        name: 'formattedData',
        value: '{openAuthPopup.all}',
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
];

export default addAuthenticationSteps;
