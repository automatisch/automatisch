import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create tweet',
  key: 'createTweet',
  description: 'Create a tweet.',
  arguments: [
    {
      label: 'Tweet body',
      key: 'tweet',
      type: 'string',
      required: true,
      description: 'The content of your new tweet.',
      variables: true,
    },
  ],

  async run($) {
    const text = $.step.parameters.tweet;
    const response = await $.http.post('/2/tweets', {
      text,
    });

    $.setActionItem({ raw: response.data });
  },
});
