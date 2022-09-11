import SendMessageToChannel from './actions/send-message-to-channel';
import FindMessage from './actions/find-message';
import SlackClient from './client';

export default class Actions {
  client: SlackClient;
  sendMessageToChannel: SendMessageToChannel;
  findMessage: FindMessage;

  constructor(client: SlackClient) {
    this.client = client;
    this.sendMessageToChannel = new SendMessageToChannel(client);
    this.findMessage = new FindMessage(client);
  }
}
