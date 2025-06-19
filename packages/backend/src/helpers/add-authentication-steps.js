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
    arguments: [],
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
    arguments: [],
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
        name: 'formattedData',
        value: '{openAuthPopup.all}',
      },
    ],
  },
  {
    type: 'mutation',
    name: 'verifyConnection',
    arguments: [],
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
        name: 'oauthClientId',
        value: '{oauthClientId}',
      },
    ],
  },
  {
    type: 'mutation',
    name: 'generateAuthUrl',
    arguments: [],
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
        name: 'formattedData',
        value: '{openAuthPopup.all}',
      },
    ],
  },
  {
    type: 'mutation',
    name: 'verifyConnection',
    arguments: [],
  },
];

export default addAuthenticationSteps;
