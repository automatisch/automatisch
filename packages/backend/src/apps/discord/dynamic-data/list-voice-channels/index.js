export default {
  name: 'List voice channels',
  key: 'listVoiceChannels',

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
        // filter in voice and stage channels only
        return channel.type === 2 || channel.type === 13;
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
