import TwitterClient from '../index';

export default class CreateTweet {
  client: TwitterClient;

  constructor(client: TwitterClient) {
    this.client = client;
  }

  async run(text: string) {
    try {
      const token = {
        key: this.client.connection.formattedData.accessToken as string,
        secret: this.client.connection.formattedData.accessSecret as string,
      };

      const requestData = {
        url: `${TwitterClient.baseUrl}/2/tweets`,
        method: 'POST',
      };

      const authHeader = this.client.oauthClient.toHeader(
        this.client.oauthClient.authorize(requestData, token)
      );

      const response = await this.client.httpClient.post(
        `/2/tweets`,
        { text },
        { headers: { ...authHeader } }
      );

      return response;
    } catch (error) {
      const errorMessage = error.response.data.detail;
      throw new Error(`Error occured while creating a tweet: ${errorMessage}`);
    }
  }
}
