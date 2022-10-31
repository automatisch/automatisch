import defineTrigger from '../../../../helpers/define-trigger';
import myFollowers from './my-followers';

export default defineTrigger({
  name: 'New follower of me',
  key: 'myFollowers',
  pollInterval: 15,
  description: 'Will be triggered when you have a new follower.',

  async run($) {
    await myFollowers($);
  },
});
