import type { IAuthentication, IJSONObject } from '@automatisch/types';
import SlackClient from './client';

export default class Authentication implements IAuthentication {
  client: SlackClient;

  static requestOptions: IJSONObject = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  constructor(client: SlackClient) {
    this.client = client;
  }

  async verifyCredentials() {
    const { bot_id: botId, user: screenName } =
      await this.client.verifyAccessToken.run();

    return {
      botId,
      screenName,
      token: this.client.connection.formattedData.accessToken,
    };
  }

  async isStillVerified() {
    try {
      await this.client.verifyAccessToken.run();
      return true;
    } catch (error) {
      return false;
    }
  }
}
