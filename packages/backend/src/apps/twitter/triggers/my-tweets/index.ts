import defineTrigger from '../../../../helpers/define-trigger';
import getUserTweets from '../../common/get-user-tweets';

export default defineTrigger({
  name: 'My tweets',
  key: 'myTweets',
  pollInterval: 15,
  description: 'Triggers when you tweet something new.',

  async run($) {
    await getUserTweets($, { currentUser: true });
  },
});
