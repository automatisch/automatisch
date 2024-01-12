function addAuthenticationSteps(app) {
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
    type: 'mutation',
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
    type: 'mutation',
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
    type: 'mutation',
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
    type: 'mutation',
    name: 'generateAuthUrl',
    arguments: [
      {
        name: 'id',
        value: '{createConnection.id}',
      },
    ],
  },
  {
    type: 'openWithPopup',
    name: 'openAuthPopup',
    arguments: [
      {
        name: 'url',
        value: '{generateAuthUrl.url}',
      },
    ],
  },
  {
    type: 'mutation',
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
    type: 'mutation',
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
    type: 'mutation',
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
    type: 'mutation',
    name: 'generateAuthUrl',
    arguments: [
      {
        name: 'id',
        value: '{createConnection.id}',
      },
    ],
  },
  {
    type: 'openWithPopup',
    name: 'openAuthPopup',
    arguments: [
      {
        name: 'url',
        value: '{generateAuthUrl.url}',
      },
    ],
  },
  {
    type: 'mutation',
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
    type: 'mutation',
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
