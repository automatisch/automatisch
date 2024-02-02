export default {
  name: 'List channels',
  key: 'listChannels',

  async run($) {
    const channels = {
      data: [],
      error: null,
    };

    let nextCursor;
    do {
      const response = await $.http.get('/conversations.list', {
        params: {
          types: 'public_channel,private_channel',
          cursor: nextCursor,
          limit: 1000,
        },
      });

      nextCursor = response.data.response_metadata?.next_cursor;

      if (response.data.error === 'missing_scope') {
        throw new Error(
          `Missing "${response.data.needed}" scope while authorizing. Please, reconnect your connection!`
        );
      }

      if (response.data.ok === false) {
        throw new Error(JSON.stringify(response.data, null, 2));
      }

      for (const channel of response.data.channels) {
        channels.data.push({
          value: channel.id,
          name: channel.name,
        });
      }
    } while (nextCursor);

    return channels;
  },
};
