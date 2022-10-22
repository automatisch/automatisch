import defineTrigger from '../../../../helpers/define-trigger';
import getUserTweets from '../../common/get-user-tweets';

export default defineTrigger({
  name: 'User Tweets',
  key: 'userTweets',
  pollInterval: 15,
  description: 'Will be triggered when a specific user tweet something new.',
  substeps: [
    {
      key: 'chooseConnection',
      name: 'Choose connection',
    },
    {
      key: 'chooseTrigger',
      name: 'Set up a trigger',
      arguments: [
        {
          label: 'Username',
          key: 'username',
          type: 'string',
          required: true,
        },
      ],
    },
    {
      key: 'testStep',
      name: 'Test trigger',
    },
  ],

  async run($) {
    await getUserTweets($, { currentUser: false });
  },

  sort(tweet, nextTweet) {
    return Number(nextTweet.meta.internalId) - Number(tweet.meta.internalId);
  },
});
