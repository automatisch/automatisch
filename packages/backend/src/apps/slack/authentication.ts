import type { IAuthentication, IApp, IJSONObject } from '@automatisch/types';
import HttpClient from '../../helpers/http-client';
import qs from 'qs';

export default class Authentication implements IAuthentication {
  appData: IApp;
  connectionData: IJSONObject;
  client: HttpClient;
  static requestOptions: IJSONObject = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  constructor(appData: IApp, connectionData: IJSONObject) {
    this.client = new HttpClient({ baseURL: 'https://slack.com/api' });

    this.connectionData = connectionData;
    this.appData = appData;
  }

  async verifyCredentials() {
    const response = await this.client.post(
      '/auth.test',
      qs.stringify({ token: this.connectionData.accessToken }),
      Authentication.requestOptions
    );

    if (response.data.ok === false) {
      throw new Error(
        `Error occured while verifying credentials: ${response.data.error}.(More info: https://api.slack.com/methods/auth.test#errors)`
      );
    }

    const { bot_id: botId, user: screenName } = response.data;

    return {
      botId,
      screenName,
      token: this.connectionData.accessToken,
    };
  }

  async isStillVerified() {
    try {
      await this.client.post(
        '/auth.test',
        qs.stringify({ token: this.connectionData.accessToken }),
        Authentication.requestOptions
      );

      return true;
    } catch (error) {
      return false;
    }
  }
}
