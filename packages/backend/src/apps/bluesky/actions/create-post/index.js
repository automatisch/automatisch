import { BskyAgent, RichText } from '@atproto/api';

import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create post',
  key: 'createPost',
  description: 'Creates a new post.',
  arguments: [
    {
      label: 'Text',
      key: 'text',
      type: 'string',
      required: true,
      variables: true,
      description: '',
    },
  ],

  async run($) {
    const text = $.step.parameters.text;
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
      },
    };

    const { data } = await $.http.post('/com.atproto.repo.createRecord', body);

    $.setActionItem({ raw: data });
  },
});
