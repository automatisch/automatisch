import { IJSONObject } from '@automatisch/types';
import qs from 'qs';
import SlackClient from '../index';

export default class VerifyAccessToken {
  client: SlackClient;

  static requestOptions: IJSONObject = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  constructor(client: SlackClient) {
    this.client = client;
  }

  async run() {
    const response = await this.client.httpClient.post(
      '/auth.test',
      qs.stringify({
        token: this.client.connection.formattedData.accessToken,
      }),
      VerifyAccessToken.requestOptions
    );

    if (response.data.ok === false) {
      throw new Error(
        `Error occured while verifying credentials: ${response.data.error}.(More info: https://api.slack.com/methods/auth.test#errors)`
      );
    }

    return response.data;
  }
}
