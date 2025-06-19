import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New pull requests',
  key: 'newPullRequests',
  pollInterval: 15,
  description: 'Triggers when the user creates a new pull request.',
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
      label: 'Which types of pulls should this trigger on?',
      key: 'pullType',
      type: 'dropdown',
      description: '',
      required: false,
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
      label: 'Type of Sort?',
      key: 'typeOfSort',
      type: 'dropdown',
      description: '',
      required: false,
      variables: true,
      value: 'all',
      options: [
        {
          label: 'Oldest',
          value: 'oldest',
        },
        {
          label: 'Recent Update',
          value: 'recentupdate',
        },
        {
          label: 'Least Update',
          value: 'leastupdate',
        },
        {
          label: 'Most Comment',
          value: 'mostcomment',
        },
        {
          label: 'Least Comment',
          value: 'leastcomment',
        },
        {
          label: 'Priority',
          value: 'priority',
        },
      ],
    },
  ],

  async run($) {
    const repo = $.step.parameters.repo;
    const typeOfSort = $.step.parameters.typeOfSort;
    const pullType = $.step.parameters.pullType;
    const repoOwner = $.auth.data.repoOwner;
    const params = {
      page: 1,
      limit: 100,
      sort: typeOfSort,
      state: pullType,
    };

    let totalCount;
    let totalRequestedCount;
    do {
      const { data, headers } = await $.http.get(
        `/repos/${repoOwner}/${repo}/pulls`,
        {
          params,
        }
      );
      params.page = params.page + 1;
      totalCount = Number(headers['x-total-count']);
      totalRequestedCount = params.page * params.limit;

      if (data?.length) {
        for (const pullRequest of data) {
          $.pushTriggerItem({
            raw: pullRequest,
            meta: {
              internalId: pullRequest.id.toString(),
            },
          });
        }
      }
    } while (totalRequestedCount <= totalCount);
  },
});
