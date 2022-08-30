import TwitterClient from '../index';

export default class GetCurrentUser {
  client: TwitterClient;

  constructor(client: TwitterClient) {
    this.client = client;
  }

  async run() {
    const token = {
      key: this.client.connection.formattedData.accessToken as string,
      secret: this.client.connection.formattedData.accessSecret as string,
    };

    const requestPath = '/2/users/me';

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

    const currentUser = response.data.data;

    return currentUser;
  }
}
