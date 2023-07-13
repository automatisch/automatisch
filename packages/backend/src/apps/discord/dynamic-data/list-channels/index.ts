import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List channels',
  key: 'listChannels',

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
        // filter in text channels and announcement channels only
        return channel.type === 0 || channel.type === 5;
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
