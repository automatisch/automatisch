export default {
  name: 'List channels',
  key: 'listChannels',

  async run($) {
    const channels = {
      data: [],
      error: null,
    };

    const response = await $.http.get('/api/v4/users/me/channels'); // this endpoint will return only channels user joined, there is no endpoint to list all channels available for user

    for (const channel of response.data) {
      channels.data.push({
        value: channel.id,
        name: channel.display_name || channel.id, // it's possible for channel to not have any name thus falling back to using id
      });
    }

    return channels;
  },
};
