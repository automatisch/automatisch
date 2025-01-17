export default {
  name: 'List waiters',
  key: 'listWaiters',

  async run($) {
    const response = await $.http.get('/v2/waiters');

    const waiters = response.data.data.map((waiter) => ({
      value: waiter.id,
      name: waiter.attributes.name,
    }));

    return { data: waiters };
  },
};
