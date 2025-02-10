export default {
  name: 'List threads',
  key: 'listThreads',

  async run($) {
    const threads = {
      data: [],
    };
    const userId = $.auth.data.userId;

    const { data } = await $.http.get(`/gmail/v1/users/${userId}/threads`);

    if (data.threads) {
      for (const thread of data.threads) {
        const { data: threadData } = await $.http.get(
          `/gmail/v1/users/${userId}/threads/${thread.id}`
        );
        const subject = threadData.messages[0].payload.headers.find(
          (header) => header.name === 'Subject'
        );

        threads.data.push({
          value: thread.id,
          name: subject?.value,
        });
      }
    }

    return threads;
  },
};
