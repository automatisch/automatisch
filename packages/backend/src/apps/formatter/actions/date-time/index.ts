import defineAction from '../../../../helpers/define-action';

import formatDateTime from './transformers/format-date-time';

const transformers = {
  formatDateTime,
};

export default defineAction({
  name: 'Date / Time',
  key: 'date-time',
  description: 'Perform date and time related transformations on your data.',
  arguments: [
    {
      label: 'Transform',
      key: 'transform',
      type: 'dropdown' as const,
      required: true,
      variables: true,
      options: [{ label: 'Format Date / Time', value: 'formatDateTime' }],
      additionalFields: {
        type: 'query',
        name: 'getDynamicFields',
        arguments: [
          {
            name: 'key',
            value: 'listTransformOptions',
          },
          {
            name: 'parameters.transform',
            value: '{parameters.transform}',
          },
        ],
      },
    },
  ],

  async run($) {
    const transformerName = $.step.parameters
      .transform as keyof typeof transformers;
    const output = transformers[transformerName]($);

    $.setActionItem({
      raw: {
        output,
      },
    });
  },
});
