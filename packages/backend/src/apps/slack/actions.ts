import SendMessageToChannel from './actions/send-message-to-channel';
import SlackClient from './client';

export default class Actions {
  client: SlackClient;
  sendMessageToChannel: SendMessageToChannel;

  constructor(client: SlackClient) {
    this.client = client;
    this.sendMessageToChannel = new SendMessageToChannel(client);
  }
}
