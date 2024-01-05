import defineTrigger from '../../../../helpers/define-trigger.js';
import newStargazers from './new-stargazers.js';

export default defineTrigger({
  name: 'New stargazers',
  key: 'newStargazers',
  pollInterval: 15,
  description: 'Triggers when a user stars a repository',
  arguments: [
    {
      label: 'Repo',
      key: 'repo',
      type: 'dropdown',
      required: true,
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listRepos',
          },
        ],
      },
    },
  ],

  async run($) {
    await newStargazers($);
  },
});
