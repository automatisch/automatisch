import { IGlobalVariable, IJSONObject } from '@automatisch/types';

type TChannel = {
  id: string;
  display_name: string;
};

type TResponse = {
  data: TChannel[];
};

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

    const response: TResponse = await $.http.get('/api/v4/users/me/channels'); // this endpoint will return only channels user joined, there is no endpoint to list all channels available for user

    for (const channel of response.data) {
      channels.data.push({
        value: channel.id as string,
        name: (channel.display_name as string) || (channel.id as string), // it's possible for channel to not have any name thus falling back to using id
      });
    }

    return channels;
  },
};
