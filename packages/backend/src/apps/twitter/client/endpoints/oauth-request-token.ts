import { IJSONObject } from '@automatisch/types';
import TwitterClient from '../index';

export default class OAuthRequestToken {
  client: TwitterClient;

  constructor(client: TwitterClient) {
    this.client = client;
  }

  async run(callbackUrl: string) {
    try {
      const requestData = {
        url: `${TwitterClient.baseUrl}/oauth/request_token`,
        method: 'POST',
        data: { oauth_callback: callbackUrl },
      };

      const authHeader = this.client.oauthClient.toHeader(
        this.client.oauthClient.authorize(requestData)
      );

      const response = await this.client.httpClient.post(
        `/oauth/request_token`,
        null,
        {
          headers: { ...authHeader },
        }
      );

      return response;
    } catch (error) {
      const errorMessages = error.response.data.errors
        .map((error: IJSONObject) => error.message)
        .join(' ');

      throw new Error(
        `Error occured while verifying credentials: ${errorMessages}`
      );
    }
  }
}
