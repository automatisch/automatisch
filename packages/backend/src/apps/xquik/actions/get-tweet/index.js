import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Get tweet',
  key: 'getTweet',
  description: 'Get a tweet with full text, author, metrics, and media.',
  arguments: [
    {
      label: 'Tweet ID',
      key: 'id',
      type: 'string',
      required: true,
      variables: true,
      description: 'Tweet ID.',
    },
  ],

  async run($) {
    const { data } = await $.http.get(`/x/tweets/${$.step.parameters.id}`);

    $.setActionItem({
      raw: data,
    });
  },
});
