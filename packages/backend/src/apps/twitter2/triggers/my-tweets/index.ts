import { IGlobalVariable } from '@automatisch/types';
import getCurrentUser from '../../common/get-current-user';
import getUserByUsername from '../../common/get-user-by-username';
import getUserTweets from '../../common/get-user-tweets';

export default {
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

  async run($: IGlobalVariable) {
    return this.getTweets($, await $.db.flow.lastInternalId());
  },

  async testRun($: IGlobalVariable) {
    return this.getTweets($);
  },

  async getTweets($: IGlobalVariable, lastInternalId?: string) {
    const { username } = await getCurrentUser($);
    const user = await getUserByUsername($, username);

    const tweets = await getUserTweets($, user.id, lastInternalId);
    return tweets;
  },
};
