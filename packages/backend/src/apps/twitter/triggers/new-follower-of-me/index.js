import defineTrigger from '../../../../helpers/define-trigger.js';
import myFollowers from './my-followers.js';

export default defineTrigger({
  name: 'New follower of me',
  key: 'newFollowerOfMe',
  pollInterval: 15,
  description: 'Triggers when you have a new follower.',

  async run($) {
    await myFollowers($);
  },
});
