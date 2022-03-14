import type { IAuthentication, IApp, IJSONObject } from '@automatisch/types';
import { WebClient } from '@slack/web-api';

export default class Authentication implements IAuthentication {
  appData: IApp;
  connectionData: IJSONObject;
  client: WebClient;

  constructor(appData: IApp, connectionData: IJSONObject) {
    this.client = new WebClient();

    this.connectionData = connectionData;
    this.appData = appData;
  }

  async verifyCredentials() {
    const { bot_id: botId, user: screenName } = await this.client.auth.test({
      token: this.connectionData.accessToken as string,
    });

    return {
      botId,
      screenName,
      token: this.connectionData.accessToken,
    };
  }

  async isStillVerified() {
    try {
      await this.client.auth.test({
        token: this.connectionData.accessToken as string,
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}
