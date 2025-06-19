import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Delete waiter',
  key: 'deleteWaiter',
  description:
    'Cancels waiting. The provided waiter will be removed from the queue.',
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

    const { data } = await $.http.delete(`/v2/waiters/${waiterId}`);

    $.setActionItem({ raw: { output: data } });
  },
});
