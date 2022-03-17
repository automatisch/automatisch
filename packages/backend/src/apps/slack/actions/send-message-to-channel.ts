import { WebClient } from '@slack/web-api';
import { IJSONObject } from '@automatisch/types';

export default class SendMessageToChannel {
  client: WebClient;
  parameters: IJSONObject;

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    this.client = new WebClient(connectionData.accessToken as string);
    this.parameters = parameters;
  }

  async run() {
    const result = await this.client.chat.postMessage({
      channel: this.parameters.channel as string,
      text: this.parameters.message as string,
    });

    return result;
  }
}
