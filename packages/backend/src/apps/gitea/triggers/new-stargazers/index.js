import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New stargazers',
  key: 'newStargazers',
  pollInterval: 15,
  description: 'Triggers when a user stars a repository.',
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
        `/repos/${repoOwner}/${repo}/stargazers`,
        {
          params,
        }
      );
      params.page = params.page + 1;
      totalCount = Number(headers['x-total-count']);
      totalRequestedCount = params.page * params.limit;

      if (data?.length) {
        for (const stargazer of data) {
          $.pushTriggerItem({
            raw: stargazer,
            meta: {
              internalId: stargazer.id.toString(),
            },
          });
        }
      }
    } while (totalRequestedCount <= totalCount);
  },
});
