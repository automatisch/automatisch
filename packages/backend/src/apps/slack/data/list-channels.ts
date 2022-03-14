import type { IJSONObject } from '@automatisch/types';
import { WebClient } from '@slack/web-api';

export default class ListChannels {
  client: WebClient;

  constructor(connectionData: IJSONObject) {
    this.client = new WebClient(connectionData.accessToken as string);
  }

  async run() {
    const { channels } = await this.client.conversations.list();

    return channels.map((channel) => {
      return {
        value: channel.id,
        name: channel.name,
      };
    });
  }
}
