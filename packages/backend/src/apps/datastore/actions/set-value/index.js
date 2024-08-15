import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Set value',
  key: 'setValue',
  description: 'Set value to the persistent datastore.',
  arguments: [
    {
      label: 'Key',
      key: 'key',
      type: 'string',
      required: true,
      description: 'The key of your value to set.',
      variables: true,
    },
    {
      label: 'Value',
      key: 'value',
      type: 'string',
      required: true,
      description: 'The value to set.',
      variables: true,
    },
  ],

  async run($) {
    const keyValuePair = await $.datastore.set({
      key: $.step.parameters.key,
      value: $.step.parameters.value,
    });

    $.setActionItem({
      raw: keyValuePair,
    });
  },
});
