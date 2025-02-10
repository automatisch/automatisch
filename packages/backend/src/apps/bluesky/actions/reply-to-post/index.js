import { BskyAgent, RichText } from '@atproto/api';

import defineAction from '../../../../helpers/define-action.js';
import getReplyRefs from '../../common/get-reply-refs.js';

export default defineAction({
  name: 'Reply to post',
  key: 'replyToPost',
  description: 'Replies to a post.',
  arguments: [
    {
      label: 'Post Url',
      key: 'postUrl',
      type: 'string',
      required: true,
      variables: true,
      description: 'Enter whole post url you want to reply here.',
    },
    {
      label: 'Text',
      key: 'text',
      type: 'string',
      required: true,
      variables: true,
      description: 'Your post.',
    },
  ],

  async run($) {
    const text = $.step.parameters.text;
    const postUrl = $.step.parameters.postUrl;

    const replyRefs = await getReplyRefs($, postUrl);

    const agent = new BskyAgent({ service: 'https://bsky.social/xrpc' });
    const richText = new RichText({ text });
    await richText.detectFacets(agent);

    const body = {
      repo: $.auth.data.did,
      collection: 'app.bsky.feed.post',
      record: {
        $type: 'app.bsky.feed.post',
        text: richText.text,
        facets: richText.facets,
        createdAt: new Date().toISOString(),
        reply: replyRefs,
      },
    };

    const { data } = await $.http.post('/com.atproto.repo.createRecord', body);

    $.setActionItem({ raw: data });
  },
});
