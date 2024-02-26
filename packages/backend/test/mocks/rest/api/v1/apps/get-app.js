const getAppMock = (appKey) => {
  if (!appKey === 'github') return;

  return {
    data: {
      actions: [
        {
          description: 'Creates a new issue.',
          key: 'createIssue',
          name: 'Create issue',
          substeps: [
            {
              key: 'chooseConnection',
              name: 'Choose connection',
            },
            {
              arguments: [
                {
                  key: 'repo',
                  label: 'Repo',
                  required: false,
                  source: {
                    arguments: [
                      {
                        name: 'key',
                        value: 'listRepos',
                      },
                    ],
                    name: 'getDynamicData',
                    type: 'query',
                  },
                  type: 'dropdown',
                  variables: true,
                },
                {
                  key: 'title',
                  label: 'Title',
                  required: true,
                  type: 'string',
                  variables: true,
                },
                {
                  key: 'body',
                  label: 'Body',
                  required: true,
                  type: 'string',
                  variables: true,
                },
              ],
              key: 'chooseTrigger',
              name: 'Set up action',
            },
            {
              key: 'testStep',
              name: 'Test action',
            },
          ],
        },
      ],
      apiBaseUrl: 'https://api.github.com',
      auth: {
        authenticationSteps: [
          {
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
            name: 'createConnection',
            type: 'mutation',
          },
          {
            arguments: [
              {
                name: 'id',
                value: '{createConnection.id}',
              },
            ],
            name: 'generateAuthUrl',
            type: 'mutation',
          },
          {
            arguments: [
              {
                name: 'url',
                value: '{generateAuthUrl.url}',
              },
            ],
            name: 'openAuthPopup',
            type: 'openWithPopup',
          },
          {
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
            name: 'updateConnection',
            type: 'mutation',
          },
          {
            arguments: [
              {
                name: 'id',
                value: '{createConnection.id}',
              },
            ],
            name: 'verifyConnection',
            type: 'mutation',
          },
        ],
        fields: [
          {
            clickToCopy: true,
            description:
              'When asked to input an OAuth callback or redirect URL in Github OAuth, enter the URL above.',
            docUrl: 'https://automatisch.io/docs/github#oauth-redirect-url',
            key: 'oAuthRedirectUrl',
            label: 'OAuth Redirect URL',
            placeholder: null,
            readOnly: true,
            required: true,
            type: 'string',
            value: 'http://localhost:3000/app/github/connections/add',
          },
          {
            clickToCopy: false,
            description: null,
            docUrl: 'https://automatisch.io/docs/github#client-id',
            key: 'consumerKey',
            label: 'Client ID',
            placeholder: null,
            readOnly: false,
            required: true,
            type: 'string',
            value: null,
          },
          {
            clickToCopy: false,
            description: null,
            docUrl: 'https://automatisch.io/docs/github#client-secret',
            key: 'consumerSecret',
            label: 'Client Secret',
            placeholder: null,
            readOnly: false,
            required: true,
            type: 'string',
            value: null,
          },
        ],
        reconnectionSteps: [
          {
            arguments: [
              {
                name: 'id',
                value: '{connection.id}',
              },
            ],
            name: 'resetConnection',
            type: 'mutation',
          },
          {
            arguments: [
              {
                name: 'id',
                value: '{connection.id}',
              },
              {
                name: 'formattedData',
                value: '{fields.all}',
              },
            ],
            name: 'updateConnection',
            type: 'mutation',
          },
          {
            arguments: [
              {
                name: 'id',
                value: '{connection.id}',
              },
            ],
            name: 'generateAuthUrl',
            type: 'mutation',
          },
          {
            arguments: [
              {
                name: 'url',
                value: '{generateAuthUrl.url}',
              },
            ],
            name: 'openAuthPopup',
            type: 'openWithPopup',
          },
          {
            arguments: [
              {
                name: 'id',
                value: '{connection.id}',
              },
              {
                name: 'formattedData',
                value: '{openAuthPopup.all}',
              },
            ],
            name: 'updateConnection',
            type: 'mutation',
          },
          {
            arguments: [
              {
                name: 'id',
                value: '{connection.id}',
              },
            ],
            name: 'verifyConnection',
            type: 'mutation',
          },
        ],
        sharedAuthenticationSteps: [
          {
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
            name: 'createConnection',
            type: 'mutation',
          },
          {
            arguments: [
              {
                name: 'id',
                value: '{createConnection.id}',
              },
            ],
            name: 'generateAuthUrl',
            type: 'mutation',
          },
          {
            arguments: [
              {
                name: 'url',
                value: '{generateAuthUrl.url}',
              },
            ],
            name: 'openAuthPopup',
            type: 'openWithPopup',
          },
          {
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
            name: 'updateConnection',
            type: 'mutation',
          },
          {
            arguments: [
              {
                name: 'id',
                value: '{createConnection.id}',
              },
            ],
            name: 'verifyConnection',
            type: 'mutation',
          },
        ],
        sharedReconnectionSteps: [
          {
            arguments: [
              {
                name: 'id',
                value: '{connection.id}',
              },
            ],
            name: 'resetConnection',
            type: 'mutation',
          },
          {
            arguments: [
              {
                name: 'id',
                value: '{connection.id}',
              },
              {
                name: 'appAuthClientId',
                value: '{appAuthClientId}',
              },
            ],
            name: 'updateConnection',
            type: 'mutation',
          },
          {
            arguments: [
              {
                name: 'id',
                value: '{connection.id}',
              },
            ],
            name: 'generateAuthUrl',
            type: 'mutation',
          },
          {
            arguments: [
              {
                name: 'url',
                value: '{generateAuthUrl.url}',
              },
            ],
            name: 'openAuthPopup',
            type: 'openWithPopup',
          },
          {
            arguments: [
              {
                name: 'id',
                value: '{connection.id}',
              },
              {
                name: 'formattedData',
                value: '{openAuthPopup.all}',
              },
            ],
            name: 'updateConnection',
            type: 'mutation',
          },
          {
            arguments: [
              {
                name: 'id',
                value: '{connection.id}',
              },
            ],
            name: 'verifyConnection',
            type: 'mutation',
          },
        ],
      },
      authDocUrl: 'https://automatisch.io/docs/apps/github/connection',
      baseUrl: 'https://github.com',
      beforeRequest: [null],
      dynamicData: [
        {
          key: 'listLabels',
          name: 'List labels',
        },
        {
          key: 'listRepos',
          name: 'List repos',
        },
      ],
      iconUrl: 'http://localhost:3000/apps/github/assets/favicon.svg',
      key: 'github',
      name: 'GitHub',
      primaryColor: '000000',
      supportsConnections: true,
      triggers: [
        {
          description: 'Triggers when a new issue is created',
          key: 'newIssues',
          name: 'New issues',
          pollInterval: 15,
          substeps: [
            {
              key: 'chooseConnection',
              name: 'Choose connection',
            },
            {
              arguments: [
                {
                  key: 'repo',
                  label: 'Repo',
                  required: false,
                  source: {
                    arguments: [
                      {
                        name: 'key',
                        value: 'listRepos',
                      },
                    ],
                    name: 'getDynamicData',
                    type: 'query',
                  },
                  type: 'dropdown',
                  variables: false,
                },
                {
                  description: 'Defaults to any issue you can see.',
                  key: 'issueType',
                  label: 'Which types of issues should this trigger on?',
                  options: [
                    {
                      label: 'Any issue you can see',
                      value: 'all',
                    },
                    {
                      label: 'Only issues assigned to you',
                      value: 'assigned',
                    },
                    {
                      label: 'Only issues created by you',
                      value: 'created',
                    },
                    {
                      label: "Only issues you're mentioned in",
                      value: 'mentioned',
                    },
                    {
                      label: "Only issues you're subscribed to",
                      value: 'subscribed',
                    },
                  ],
                  required: true,
                  type: 'dropdown',
                  value: 'all',
                  variables: false,
                },
                {
                  dependsOn: ['parameters.repo'],
                  description:
                    'Only trigger on issues when this label is added.',
                  key: 'label',
                  label: 'Label',
                  required: false,
                  source: {
                    arguments: [
                      {
                        name: 'key',
                        value: 'listLabels',
                      },
                      {
                        name: 'parameters.repo',
                        value: '{parameters.repo}',
                      },
                    ],
                    name: 'getDynamicData',
                    type: 'query',
                  },
                  type: 'dropdown',
                  variables: false,
                },
              ],
              key: 'chooseTrigger',
              name: 'Set up a trigger',
            },
            {
              key: 'testStep',
              name: 'Test trigger',
            },
          ],
        },
        {
          description: 'Triggers when a new pull request is created',
          key: 'newPullRequests',
          name: 'New pull requests',
          pollInterval: 15,
          substeps: [
            {
              key: 'chooseConnection',
              name: 'Choose connection',
            },
            {
              arguments: [
                {
                  key: 'repo',
                  label: 'Repo',
                  required: true,
                  source: {
                    arguments: [
                      {
                        name: 'key',
                        value: 'listRepos',
                      },
                    ],
                    name: 'getDynamicData',
                    type: 'query',
                  },
                  type: 'dropdown',
                  variables: false,
                },
              ],
              key: 'chooseTrigger',
              name: 'Set up a trigger',
            },
            {
              key: 'testStep',
              name: 'Test trigger',
            },
          ],
        },
        {
          description: 'Triggers when a user stars a repository',
          key: 'newStargazers',
          name: 'New stargazers',
          pollInterval: 15,
          substeps: [
            {
              key: 'chooseConnection',
              name: 'Choose connection',
            },
            {
              arguments: [
                {
                  key: 'repo',
                  label: 'Repo',
                  required: true,
                  source: {
                    arguments: [
                      {
                        name: 'key',
                        value: 'listRepos',
                      },
                    ],
                    name: 'getDynamicData',
                    type: 'query',
                  },
                  type: 'dropdown',
                  variables: false,
                },
              ],
              key: 'chooseTrigger',
              name: 'Set up a trigger',
            },
            {
              key: 'testStep',
              name: 'Test trigger',
            },
          ],
        },
        {
          description: 'Triggers when a user watches a repository',
          key: 'newWatchers',
          name: 'New watchers',
          pollInterval: 15,
          substeps: [
            {
              key: 'chooseConnection',
              name: 'Choose connection',
            },
            {
              arguments: [
                {
                  key: 'repo',
                  label: 'Repo',
                  required: true,
                  source: {
                    arguments: [
                      {
                        name: 'key',
                        value: 'listRepos',
                      },
                    ],
                    name: 'getDynamicData',
                    type: 'query',
                  },
                  type: 'dropdown',
                  variables: false,
                },
              ],
              key: 'chooseTrigger',
              name: 'Set up a trigger',
            },
            {
              key: 'testStep',
              name: 'Test trigger',
            },
          ],
        },
      ],
    },
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'Object',
    },
  };
};

export default getAppMock;
