import { IJSONObject } from '@automatisch/types';
import SlackClient from '../client';

export default class ListChannels {
  client: SlackClient;

  constructor(client: SlackClient) {
    this.client = client;
  }

  async run() {
    const response = await this.client.httpClient.get('/conversations.list', {
      headers: {
        Authorization: `Bearer ${this.client.connection.formattedData.accessToken}`,
      },
    });

    if (response.data.ok === 'false') {
      throw new Error(
        `Error occured while fetching slack channels: ${response.data.error}`
      );
    }

    return response.data.channels.map((channel: IJSONObject) => {
      return {
        value: channel.id,
        name: channel.name,
      };
    });
  }
}
