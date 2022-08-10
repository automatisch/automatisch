import TwitterClient from '../index';

export default class VerifyAccessToken {
  client: TwitterClient;

  constructor(client: TwitterClient) {
    this.client = client;
  }

  async run() {
    try {
      return await this.client.httpClient.post(
        `/oauth/access_token?oauth_verifier=${this.client.connectionData.oauthVerifier}&oauth_token=${this.client.connectionData.accessToken}`,
        null
      );
    } catch (error) {
      throw new Error(error.response.data);
    }
  }
}
