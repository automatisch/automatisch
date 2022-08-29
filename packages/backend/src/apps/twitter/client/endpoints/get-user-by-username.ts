import { IJSONObject } from '@automatisch/types';
import TwitterClient from '../index';

export default class GetUserByUsername {
  client: TwitterClient;

  constructor(client: TwitterClient) {
    this.client = client;
  }

  async run(username: string) {
    const token = {
      key: this.client.connection.formattedData.accessToken as string,
      secret: this.client.connection.formattedData.accessSecret as string,
    };

    const requestPath = `/2/users/by/username/${username}`;

    const requestData = {
      url: `${TwitterClient.baseUrl}${requestPath}`,
      method: 'GET',
    };

    const authHeader = this.client.oauthClient.toHeader(
      this.client.oauthClient.authorize(requestData, token)
    );

    const response = await this.client.httpClient.get(requestPath, {
      headers: { ...authHeader },
    });

    if (response.data?.errors) {
      const errorMessages = response.data.errors
        .map((error: IJSONObject) => error.detail)
        .join(' ');

      throw new Error(
        `Error occured while fetching user data: ${errorMessages}`
      );
    }

    return response.data.data;
  }
}
