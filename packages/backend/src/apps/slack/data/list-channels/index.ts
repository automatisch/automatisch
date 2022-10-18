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

    const response = await $.http.get('/conversations.list');

    if (response.integrationError) {
      channels.error = response.integrationError;
      return channels;
    }

    if (response.data.ok === false) {
      channels.error = response.data;
      return channels;
    }

    channels.data = response.data.channels.map((channel: IJSONObject) => {
      return {
        value: channel.id,
        name: channel.name,
      };
    });

    return channels;
  },
};
