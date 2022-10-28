import defineTrigger from '../../../../helpers/define-trigger';
import getUserTweets from '../../common/get-user-tweets';

export default defineTrigger({
  name: 'My Tweets',
  key: 'myTweets',
  pollInterval: 15,
  description: 'Will be triggered when you tweet something new.',
  substeps: [
    {
      key: 'chooseConnection',
      name: 'Choose connection',
    },
    {
      key: 'testStep',
      name: 'Test trigger',
    },
  ],

  async run($) {
    await getUserTweets($, { currentUser: true });
  },
});
