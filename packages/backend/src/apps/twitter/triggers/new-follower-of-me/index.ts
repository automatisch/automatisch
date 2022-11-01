import defineTrigger from '../../../../helpers/define-trigger';
import myFollowers from './my-followers';

export default defineTrigger({
  name: 'New follower of me',
  key: 'newFollowerOfMe',
  pollInterval: 15,
  description: 'Triggers when you have a new follower.',

  async run($) {
    await myFollowers($);
  },
});
