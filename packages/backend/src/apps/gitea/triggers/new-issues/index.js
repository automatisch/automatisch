import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New issues',
  key: 'newIssues',
  pollInterval: 15,
  description: 'Triggers when a new issue is created.',
  arguments: [
    {
      label: 'Repo',
      key: 'repo',
      type: 'dropdown',
      required: true,
      variables: true,
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
      type: 'dropdown',
      description: 'Defaults to any issue you can see.',
      required: true,
      variables: true,
      value: 'all',
      options: [
        {
          label: 'Closed',
          value: 'closed',
        },
        {
          label: 'Open',
          value: 'open',
        },
        {
          label: 'All',
          value: 'all',
        },
      ],
    },
    {
      label: 'Labels',
      key: 'labels',
      type: 'dynamic',
      required: false,
      fields: [
        {
          label: 'Label',
          key: 'label',
          type: 'dropdown',
          description: 'Only trigger on issues when this label is added.',
          required: false,
          variables: true,
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
    },
  ],

  async run($) {
    const repo = $.step.parameters.repo;
    const issueType = $.step.parameters.issueType;
    const allLabels = $.step.parameters.labels;
    const formattedAllLabels = allLabels.map((label) => label.label).join(',');
    const repoOwner = $.auth.data.repoOwner;

    const params = {
      page: 1,
      limit: 100,
      state: issueType,
      labels: formattedAllLabels,
    };

    let totalCount;
    let totalRequestedCount;
    do {
      const { data, headers } = await $.http.get(
        `/repos/${repoOwner}/${repo}/issues`,
        {
          params,
        }
      );
      params.page = params.page + 1;
      totalCount = Number(headers['x-total-count']);
      totalRequestedCount = params.page * params.limit;

      if (data?.length) {
        for (const issue of data) {
          $.pushTriggerItem({
            raw: issue,
            meta: {
              internalId: issue.id.toString(),
            },
          });
        }
      }
    } while (totalRequestedCount <= totalCount);
  },
});
