import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Web search',
  key: 'webSearch',
  description: 'Queries Brave Search and get back search results from the web.',
  arguments: [
    {
      label: 'Query',
      key: 'q',
      type: 'string',
      required: true,
      variables: true,
      description: 'The search query term.',
    },
    {
      label: 'Safe search',
      key: 'safesearch',
      type: 'dropdown',
      required: true,
      description: 'Add or remove messages as needed',
      value: 'moderate',
      options: [
        {
          label: 'Off',
          value: 'off',
        },
        {
          label: 'Moderate',
          value: 'moderate',
        },
        {
          label: 'Strict',
          value: 'strict',
        },
      ],
    },
  ],

  async run($) {
    const params = {
      q: $.step.parameters.q,
      safesearch: $.step.parameters.safesearch,
    };

    const { data } = await $.http.get('/v1/web/search', { params });

    $.setActionItem({
      raw: data,
    });
  },
});
