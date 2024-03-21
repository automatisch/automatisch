import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Respond with',
  key: 'respondWith',
  description: 'Respond with defined JSON body.',
  arguments: [
    {
      label: 'Status code',
      key: 'statusCode',
      type: 'string',
      required: true,
      variables: true,
      value: '200',
    },
    {
      label: 'Headers',
      key: 'headers',
      type: 'dynamic',
      required: false,
      description: 'Add or remove headers as needed',
      fields: [
        {
          label: 'Key',
          key: 'key',
          type: 'string',
          required: true,
          description: 'Header key',
          variables: true,
        },
        {
          label: 'Value',
          key: 'value',
          type: 'string',
          required: true,
          description: 'Header value',
          variables: true,
        },
      ],
    },
    {
      label: 'Body',
      key: 'body',
      type: 'string',
      required: true,
      description: 'The content of the response body.',
      variables: true,
    },
  ],

  async run($) {
    const statusCode = parseInt($.step.parameters.statusCode, 10);
    const body = $.step.parameters.body;
    const headers = $.step.parameters.headers.reduce((result, entry) => {
      return {
        ...result,
        [entry.key]: entry.value,
      };
    }, {});

    $.setActionItem({
      raw: {
        headers,
        body,
        statusCode,
      },
    });
  },
});
