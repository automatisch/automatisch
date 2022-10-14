import { IGlobalVariable } from '@automatisch/types';
import getUserTweets from '../../common/get-user-tweets';

export default {
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

  async run($: IGlobalVariable) {
    return await getUserTweets($, {
      currentUser: false,
      userId: $.step.parameters.username as string,
      lastInternalId: $.flow.lastInternalId,
    });
  },
};
