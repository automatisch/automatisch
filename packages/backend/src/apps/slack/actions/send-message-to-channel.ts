import SlackClient from '../client';

export default class SendMessageToChannel {
  client: SlackClient;

  constructor(client: SlackClient) {
    this.client = client;
  }

  async run() {
    const channelId = this.client.step.parameters.channel as string;
    const text = this.client.step.parameters.message as string;

    const message = await this.client.postMessageToChannel.run(channelId, text);

    return message;
  }
}
