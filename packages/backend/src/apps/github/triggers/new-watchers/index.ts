import defineTrigger from '../../../../helpers/define-trigger';
import newWatchers from './new-watchers';

export default defineTrigger({
  name: 'New watchers',
  key: 'newWatchers',
  pollInterval: 15,
  description: 'Triggers when a user watches a repository',
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
    await newWatchers($);
  },
});
