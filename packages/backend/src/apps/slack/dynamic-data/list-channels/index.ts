import { IGlobalVariable, IJSONObject } from '@automatisch/types';

type TChannel = {
  id: string;
  name: string;
}

type TConversationListResponseData = {
  channels: TChannel[],
  response_metadata?: {
    next_cursor: string
  };
  needed?: string;
  error?: string;
  ok: boolean;
}

type TResponse = {
  data: TConversationListResponseData;
}

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

    let nextCursor;
    do {
      const response: TResponse = await $.http.get('/conversations.list', {
        params: {
          types: 'public_channel,private_channel,im',
          cursor: nextCursor,
          limit: 1000,
        }
      });

      nextCursor = response.data.response_metadata?.next_cursor;

      if (response.data.error === 'missing_scope') {
        throw new Error(`Missing "${response.data.needed}" scope while authorizing. Please, reconnect your connection!`);
      }

      if (response.data.ok === false) {
        throw new Error(JSON.stringify(response.data, null, 2));
      }

      for (const channel of response.data.channels) {
        channels.data.push({
          value: channel.id as string,
          name: channel.name as string,
        });
      }
    } while (nextCursor);

    return channels;
  },
};
