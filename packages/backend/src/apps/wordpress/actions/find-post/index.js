import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Find post',
  key: 'findPost',
  description: 'Finds a post by title.',
  arguments: [
    {
      label: 'Post Title',
      key: 'title',
      type: 'string',
      required: true,
      description: 'Enter the title of the post to find.',
      variables: true,
    },
  ],

  async run($) {
    const { title } = $.step.parameters;

    const response = await $.http.get('?rest_route=/wp/v2/posts', {
      params: {
        search: title,
        per_page: 1,
        orderby: 'relevance',
        order: 'desc',
      },
    });

    $.setActionItem({ raw: response.data[0] });
  },
});
