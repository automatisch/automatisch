import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Delete post',
  key: 'deletePost',
  description: 'Deletes a post.',
  arguments: [
    {
      label: 'Post ID',
      key: 'postId',
      type: 'dropdown',
      required: false,
      description: 'Choose a post to delete.',
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

    const response = await $.http.delete(`?rest_route=/wp/v2/posts/${postId}`);

    $.setActionItem({ raw: response.data });
  },
});
