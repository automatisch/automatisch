import { IActionOutput } from '@automatisch/types';
import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Create Tweet',
  key: 'createTweet',
  description: 'Create a tweet.',
  substeps: [
    {
      key: 'chooseConnection',
      name: 'Choose connection',
    },
    {
      key: 'chooseAction',
      name: 'Set up action',
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
    },
    {
      key: 'testStep',
      name: 'Test action',
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
