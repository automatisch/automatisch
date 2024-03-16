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
      label: 'JSON body',
      key: 'stringifiedJsonBody',
      type: 'string',
      required: true,
      description: 'The content of the JSON body. It must be a valid JSON.',
      variables: true,
    },
  ],

  async run($) {
    const parsedStatusCode = parseInt($.step.parameters.statusCode, 10);
    const stringifiedJsonBody = $.step.parameters.stringifiedJsonBody;
    const parsedJsonBody = JSON.parse(stringifiedJsonBody);

    $.setActionItem({
      raw: {
        body: parsedJsonBody,
        statusCode: parsedStatusCode,
      },
    });
  },
});
