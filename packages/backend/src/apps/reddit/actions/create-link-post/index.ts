import defineAction from '../../../../helpers/define-action';
import { URLSearchParams } from 'url';

export default defineAction({
  name: 'Create link post',
  key: 'createLinkPost',
  description: 'Create a new link post within a subreddit.',
  arguments: [
    {
      label: 'Title',
      key: 'title',
      type: 'string' as const,
      required: true,
      description:
        'Heading for the recent post. Limited to 300 characters or less.',
      variables: true,
    },
    {
      label: 'Subreddit',
      key: 'subreddit',
      type: 'string' as const,
      required: true,
      description: 'The subreddit for posting. Note: Exclude /r/.',
      variables: true,
    },
    {
      label: 'Url',
      key: 'url',
      type: 'string' as const,
      required: true,
      description: '',
      variables: true,
    },
  ],

  async run($) {
    const { title, subreddit, url } = $.step.parameters;

    const params = new URLSearchParams({
      kind: 'link',
      api_type: 'json',
      title: title as string,
      sr: subreddit as string,
      url: url as string,
    });

    const { data } = await $.http.post('/api/submit', params.toString());

    $.setActionItem({
      raw: data,
    });
  },
});
