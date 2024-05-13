import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'Changed watch',
  key: 'changedWatch',
  pollInterval: 15,
  description: 'Triggers when any changes detected.',
  arguments: [
    {
      label: 'Watch',
      key: 'watchId',
      type: 'dropdown',
      required: true,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listWatches',
          },
        ],
      },
    },
  ],

  async run($) {
    const watchId = $.step.parameters.watchId;

    const { data } = await $.http.get(`v1/watch/${watchId}`);

    if (Object.keys(data).length !== 0) {
      $.pushTriggerItem({
        raw: data,
        meta: {
          internalId: `${watchId}-${data.last_changed}`,
        },
      });
    }
  },
});
