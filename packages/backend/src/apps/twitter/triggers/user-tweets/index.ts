import defineTrigger from '../../../../helpers/define-trigger';
import getUserTweets from '../../common/get-user-tweets';

export default defineTrigger({
  name: 'User Tweets',
  key: 'userTweets',
  pollInterval: 15,
  description: 'Will be triggered when a specific user tweet something new.',
  arguments: [
    {
      label: 'Username',
      key: 'username',
      type: 'string' as const,
      required: true,
    },
  ],

  async run($) {
    await getUserTweets($, { currentUser: false });
  },
});
