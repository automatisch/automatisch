import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List voice channels',
  key: 'listVoiceChannels',

  async run($: IGlobalVariable) {
    const channels: {
      data: IJSONObject[];
      error: IJSONObject | null;
    } = {
      data: [],
      error: null,
    };

    const response = await $.http.get(
      `/guilds/${$.auth.data.guildId}/channels`
    );

    channels.data = response.data
      .filter((channel: IJSONObject) => {
        // filter in voice and stage channels only
        return channel.type === 2 || channel.type === 13;
      })
      .map((channel: IJSONObject) => {
        return {
          value: channel.id,
          name: channel.name,
        };
      });

    return channels;
  },
};
