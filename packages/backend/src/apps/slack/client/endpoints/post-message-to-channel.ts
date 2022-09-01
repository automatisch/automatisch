import SlackClient from '../index';

export default class PostMessageToChannel {
  client: SlackClient;

  constructor(client: SlackClient) {
    this.client = client;
  }

  async run(channelId: string, text: string) {
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

    if (response.data.ok === 'false') {
      throw new Error(
        `Error occured while posting a message to channel: ${response.data.error}`
      );
    }

    return response.data.message;
  }
}
