import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New watchers',
  key: 'newWatchers',
  pollInterval: 15,
  description: 'Triggers when a user watches a repository.',
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
  ],

  async run($) {
    const repo = $.step.parameters.repo;
    const repoOwner = $.auth.data.repoOwner;
    const params = {
      page: 1,
      limit: 100,
    };

    let totalCount;
    let totalRequestedCount;
    do {
      const { data, headers } = await $.http.get(
        `/repos/${repoOwner}/${repo}/subscribers`,
        {
          params,
        }
      );
      params.page = params.page + 1;
      totalCount = Number(headers['x-total-count']);
      totalRequestedCount = params.page * params.limit;

      if (data?.length) {
        for (const subscriber of data) {
          $.pushTriggerItem({
            raw: subscriber,
            meta: {
              internalId: subscriber.id.toString(),
            },
          });
        }
      }
    } while (totalRequestedCount <= totalCount);
  },
});
