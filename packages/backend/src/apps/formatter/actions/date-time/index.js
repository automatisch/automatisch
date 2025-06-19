import defineAction from '../../../../helpers/define-action.js';
import formatDateTime from './transformers/format-date-time.js';
import getCurrentTimestamp from './transformers/get-current-timestamp.js';
import getCurrentTimestampInSeconds from './transformers/get-current-timestamp-in-seconds.js';

const transformers = {
  formatDateTime,
  getCurrentTimestamp,
  getCurrentTimestampInSeconds,
};

export default defineAction({
  name: 'Date / Time',
  key: 'date-time',
  description: 'Perform date and time related transformations on your data.',
  arguments: [
    {
      label: 'Transform',
      key: 'transform',
      type: 'dropdown',
      required: true,
      variables: false,
      options: [
        {
          label: 'Get current timestamp',
          value: 'getCurrentTimestamp',
        },
        {
          label: 'Get current timestamp in seconds',
          value: 'getCurrentTimestampInSeconds',
        },
        {
          label: 'Format Date / Time',
          value: 'formatDateTime',
        },
      ],
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
    const transformerName = $.step.parameters.transform;
    const output = transformers[transformerName]($);

    $.setActionItem({
      raw: {
        output,
      },
    });
  },
});
