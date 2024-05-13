import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create a watch',
  key: 'createWatch',
  description: 'Creates a new change detection watch for a specific website.',
  arguments: [
    {
      label: 'URL',
      key: 'url',
      type: 'string',
      required: true,
      variables: true,
      description: 'Url you want to monitor',
    },
  ],

  async run($) {
    const url = $.step.parameters.url;

    const body = {
      url,
    };

    const response = await $.http.post('/v1/watch', body);

    $.setActionItem({ raw: response.data });
  },
});
