import defineTrigger from '../../../../helpers/define-trigger';
import myFollowers from './my-followers';

export default defineTrigger({
  name: 'New follower of me',
  key: 'myFollowers',
  pollInterval: 15,
  description: 'Will be triggered when you have a new follower.',
  dedupeStrategy: 'unique',
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
    return await myFollowers($);
  },
});
