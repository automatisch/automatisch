import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create post',
  key: 'createPost',
  description: 'Create a new post',
  arguments: [
    {
      label: 'Post',
      key: 'post',
      type: 'string',
      required: true,
      description:
        'Post content for linkedin',
      variables: true,
    },
    {
      label: 'URL',
      key: 'url',
      type: 'string',
      required: false,
      description:
        'URL for the post on linkedin',
      variables: true,
    }
  ],

  async run($) {
    const postData = {
      author: `urn:li:person:${$.auth.data.userId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: $.step.parameters.post?.trim()
          },
          shareMediaCategory: 'ARTICLE',
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

    if($.step.parameters.url) {
      postData.specificContent['com.linkedin.ugc.ShareContent'].media = [{
        status: 'READY',
        originalUrl: $.step.parameters.url,
      }];
    }

    const { data } = await $.http.post('/ugcPosts', postData);

    $.setActionItem({
      raw: data,
    });
  },
});
