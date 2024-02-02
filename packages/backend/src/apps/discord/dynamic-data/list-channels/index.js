export default {
  name: 'List channels',
  key: 'listChannels',

  async run($) {
    const channels = {
      data: [],
      error: null,
    };

    const response = await $.http.get(
      `/guilds/${$.auth.data.guildId}/channels`
    );

    channels.data = response.data
      .filter((channel) => {
        // filter in text channels and announcement channels only
        return channel.type === 0 || channel.type === 5;
      })
      .map((channel) => {
        return {
          value: channel.id,
          name: channel.name,
        };
      });

    return channels;
  },
};
