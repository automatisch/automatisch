import defineTrigger from '../../../../helpers/define-trigger';
import newStargazers from './new-stargazers';

export default defineTrigger({
  name: 'New stargazers',
  key: 'newStargazers',
  pollInterval: 15,
  description: 'Triggers when a user stars a repository',
  substeps: [
    {
      key: 'chooseConnection',
      name: 'Choose connection',
    },
    {
      key: 'chooseTrigger',
      name: 'Set up a trigger',
      arguments: [
        {
          label: 'Repo',
          key: 'repo',
          type: 'dropdown',
          required: true,
          variables: false,
          source: {
            type: 'query',
            name: 'getData',
            arguments: [
              {
                name: 'key',
                value: 'listRepos',
              },
            ],
          },
        },
      ],
    },
    {
      key: 'testStep',
      name: 'Test trigger',
    },
  ],

  async run($) {
    await newStargazers($);
  },

  sort(stargazerA, stargazerB) {
    return (
      Number(stargazerB.meta.internalId) - Number(stargazerA.meta.internalId)
    );
  },
});
