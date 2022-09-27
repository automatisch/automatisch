import SlackClient from '../index';
import { IJSONObject } from '@automatisch/types';

export default class PostMessageToChannel {
  client: SlackClient;

  constructor(client: SlackClient) {
    this.client = client;
  }

  async run(channelId: string, text: string) {
    const message: {
      data: IJSONObject | null;
      error: IJSONObject | null;
    } = {
      data: null,
      error: null,
    };

    const headers = {
      Authorization: `Bearer ${this.client.connection.formattedData.accessToken}`,
    };

    const params = {
      channel: channelId,
      text,
    };

    const response = await this.client.httpClient.post(
      '/chat.postMessage',
      params,
      { headers }
    );

    message.error = response?.integrationError;
    message.data = response?.data?.message;

    if (response.data.ok === false) {
      message.error = response.data;
    }

    return message;
  }
}
