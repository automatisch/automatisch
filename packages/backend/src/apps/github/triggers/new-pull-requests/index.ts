import defineTrigger from '../../../../helpers/define-trigger';
import newPullRequests from './new-pull-requests';

export default defineTrigger({
  name: 'New pull requests',
  key: 'newPullRequests',
  pollInterval: 15,
  description: 'Triggers when a new pull request is created',
  substeps: [
    {
      key: 'chooseConnection',
      name: 'Choose connection'
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
                value: 'listRepos'
              }
            ]
          }
        }
      ]
    },
    {
      key: 'testStep',
      name: 'Test trigger'
    }
  ],

  async run($) {
    return await newPullRequests($);
  },
});
