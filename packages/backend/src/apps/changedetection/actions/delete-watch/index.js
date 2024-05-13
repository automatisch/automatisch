import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Delete a watch',
  key: 'deleteWatch',
  description: 'Deletes a change detection watch.',
  arguments: [
    {
      label: 'Watch ID',
      key: 'watchId',
      type: 'string',
      required: true,
      variables: true,
      description: 'Watch id you want to delete',
    },
  ],

  async run($) {
    const watchId = $.step.parameters.watchId;

    await $.http.delete(`/v1/watch/${watchId}`);

    $.setActionItem({
      raw: {
        result: 'successful',
      },
    });
  },
});
