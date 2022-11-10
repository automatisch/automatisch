import defineTrigger from '../../../../helpers/define-trigger';
import newPullRequests from './new-pull-requests';

export default defineTrigger({
  name: 'New pull requests',
  key: 'newPullRequests',
  pollInterval: 15,
  description: 'Triggers when a new pull request is created',
  arguments: [
    {
      label: 'Repo',
      key: 'repo',
      type: 'dropdown' as const,
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
    await newPullRequests($);
  },
});
