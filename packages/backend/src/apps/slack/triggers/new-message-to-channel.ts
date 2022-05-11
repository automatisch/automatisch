import { IJSONObject } from '@automatisch/types';
import axios, { AxiosInstance } from 'axios';

export default class NewMessageToChannel {
  httpClient: AxiosInstance;
  parameters: IJSONObject;
  connectionData: IJSONObject;
  BASE_URL = 'https://slack.com/api';

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    this.httpClient = axios.create({ baseURL: this.BASE_URL });
    this.connectionData = connectionData;
    this.parameters = parameters;
  }

  async run() {
    // TODO: Fix after webhook implementation.
  }

  async testRun() {
    const headers = {
      Authorization: `Bearer ${this.connectionData.accessToken}`,
    };

    const params = {
      channel: this.parameters.channel,
    };

    const response = await this.httpClient.get('/conversations.history', {
      headers,
      params,
    });

    let lastMessage;

    if (this.parameters.triggerForBotMessages) {
      lastMessage = response.data.messages[0];
    } else {
      lastMessage = response.data.messages.find(
        (message: IJSONObject) =>
          !Object.prototype.hasOwnProperty.call(message, 'bot_id')
      );
    }

    return [lastMessage];
  }
}
