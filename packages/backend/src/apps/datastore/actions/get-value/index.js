import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Get value',
  key: 'getValue',
  description: 'Get value from the persistent datastore.',
  arguments: [
    {
      label: 'Key',
      key: 'key',
      type: 'string',
      required: true,
      description: 'The key of your value to get.',
      variables: true,
    },
  ],

  async run($) {
    const keyValuePair = await $.datastore.get({
      key: $.step.parameters.key,
    });

    $.setActionItem({
      raw: keyValuePair,
    });
  },
});
