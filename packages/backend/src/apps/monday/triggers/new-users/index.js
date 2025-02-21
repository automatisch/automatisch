import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New users',
  key: 'newUsers',
  pollInterval: 15,
  description: 'Triggers when a new user joins your account.',

  async run($) {
    const body = {
      query: 'query { users(newest_first: true) {  id name } }',
    };

    const { data } = await $.http.post('/', body);

    if (!data.data?.users?.length) {
      return;
    }

    for (const user of data.data.users) {
      $.pushTriggerItem({
        raw: user,
        meta: {
          internalId: user.id,
        },
      });
    }
  },
});
