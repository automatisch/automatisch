import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Search post by url',
  key: 'searchPostByUrl',
  description: 'Searches a post in a thread by url.',
  arguments: [
    {
      label: 'Post Url',
      key: 'postUrl',
      type: 'string',
      required: true,
      variables: true,
      description: 'Enter whole post url here.',
    },
  ],

  async run($) {
    const postUrl = $.step.parameters.postUrl;
    const urlParts = postUrl.split('/');
    const handle = urlParts[urlParts.length - 3];
    const postId = urlParts[urlParts.length - 1];
    const uri = `at://${handle}/app.bsky.feed.post/${postId}`;

    const params = {
      uri,
    };

    const { data } = await $.http.get('/app.bsky.feed.getPostThread', {
      params,
    });

    $.setActionItem({ raw: data });
  },
});
