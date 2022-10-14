import { IGlobalVariable } from '@automatisch/types';
import myFollowers from './my-followers';

export default {
  name: 'New follower of me',
  key: 'myFollowers',
  pollInterval: 15,
  description: 'Will be triggered when you have a new follower.',
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
    return await myFollowers($, $.flow.lastInternalId);
  },
};
