import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Search plans',
  key: 'searchPlans',
  description: 'Searches the plans of every API on the Datacircle sheet.',
  arguments: [
    {
      label: 'API slug',
      key: 'api',
      type: 'string',
      required: false,
      variables: true,
      description: 'Only the plans of this API.',
    },
    {
      label: 'Query',
      key: 'query',
      type: 'string',
      required: false,
      variables: true,
      description: 'Words to find in a plan, its provider or its API.',
    },
    {
      label: 'Limit',
      key: 'limit',
      type: 'string',
      required: false,
      variables: true,
      description: 'How many plans to return.',
    },
  ],

  async run($) {
    const params = {};

    for (const key of ['api', 'query', 'limit']) {
      if ($.step.parameters[key]) {
        params[key] = $.step.parameters[key];
      }
    }

    const { data } = await $.http.get('https://api.datacircle.dev/v1/plans', {
      params,
    });

    $.setActionItem({
      raw: data,
    });
  },
});
