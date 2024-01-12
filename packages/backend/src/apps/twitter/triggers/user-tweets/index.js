import defineTrigger from '../../../../helpers/define-trigger.js';
import getUserTweets from '../../common/get-user-tweets.js';

export default defineTrigger({
  name: 'User tweets',
  key: 'userTweets',
  pollInterval: 15,
  description: 'Triggers when a specific user tweet something new.',
  arguments: [
    {
      label: 'Username',
      key: 'username',
      type: 'string',
      required: true,
    },
  ],

  async run($) {
    await getUserTweets($, { currentUser: false });
  },
});
