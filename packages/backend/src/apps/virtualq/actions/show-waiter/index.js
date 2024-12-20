import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Show waiter',
  key: 'showWaiter',
  description: 'Returns the complete waiter information.',
  arguments: [
    {
      label: 'Waiter',
      key: 'waiterId',
      type: 'dropdown',
      required: true,
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listWaiters',
          },
        ],
      },
    },
  ],
  async run($) {
    const waiterId = $.step.parameters.waiterId;

    const { data } = await $.http.get(`/v2/waiters/${waiterId}`);

    $.setActionItem({ raw: data });
  },
});
