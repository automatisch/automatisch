import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Find post',
  key: 'findPost',
  description: 'Finds a post.',
  arguments: [
    {
      label: 'Post ID',
      key: 'postId',
      type: 'dropdown',
      required: false,
      description: 'Choose a post to update.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listPosts',
          },
        ],
      },
    },
  ],

  async run($) {
    const { postId } = $.step.parameters;

    const response = await $.http.get(`?rest_route=/wp/v2/posts/${postId}`);

    $.setActionItem({ raw: response.data });
  },
});
