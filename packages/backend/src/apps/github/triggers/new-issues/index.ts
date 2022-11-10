import defineTrigger from '../../../../helpers/define-trigger';
import newIssues from './new-issues';

export default defineTrigger({
  name: 'New issues',
  key: 'newIssues',
  pollInterval: 15,
  description: 'Triggers when a new issue is created',
  arguments: [
    {
      label: 'Repo',
      key: 'repo',
      type: 'dropdown' as const,
      required: false,
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
    {
      label: 'Which types of issues should this trigger on?',
      key: 'issueType',
      type: 'dropdown' as const,
      description: 'Defaults to any issue you can see.',
      required: true,
      variables: false,
      value: 'all',
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
          label: `Only issues you're mentioned in`,
          value: 'mentioned',
        },
        {
          label: `Only issues you're subscribed to`,
          value: 'subscribed',
        },
      ],
    },
    {
      label: 'Label',
      key: 'label',
      type: 'dropdown' as const,
      description: 'Only trigger on issues when this label is added.',
      required: false,
      variables: false,
      dependsOn: ['parameters.repo'],
      source: {
        type: 'query',
        name: 'getDynamicData',
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
      },
    },
  ],

  async run($) {
    await newIssues($);
  },
});
